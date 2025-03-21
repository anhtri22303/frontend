"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { fetchCartByUserId, updateCartItem, removeFromCart } from "@/app/api/cartApi"
import stripePromise from '@/lib/stripe-client'
import { createOrder } from "@/app/api/orderApi"

interface CartItem {
  userID: string
  productID: string
  quantity: number
  totalAmount: number
  name?: string
  image?: string
}

interface Cart {
  userID: string
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [userID, setUserID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID")
    if (storedUserID) {
      setUserID(storedUserID)
    } else {
      console.error("User ID not found in localStorage")
    }
  }, [])

  useEffect(() => {
    if (userID) {
      loadCartItems()
    }
  }, [userID])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetchCartByUserId(userID!)
      if (response && response.items) {
        setCartItems(response.items)
      }
    } catch (error) {
      console.error("Error loading cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productID: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItem(userID!, productID, newQuantity)
      setCartItems(prev =>
        prev.map(item =>
          item.productID === productID ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (productID: string) => {
    try {
      await removeFromCart(userID!, productID)
      setCartItems(prev => prev.filter(item => item.productID !== productID))
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Failed to remove item")
    }
  }

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const userID = localStorage.getItem("userID");
  
      const orderData = {
        customerID: userID!,
        orderDate: new Date().toISOString(),
        status: "PENDING",
        totalAmount: total,
        orderDetails: cartItems.map(item => ({
          productID: item.productID,
          quantity: item.quantity,
          price: item.totalAmount
        }))
      };
  
      const orderResponse = await createOrder(userID!, orderData);
      console.log("Order created response:", orderResponse);
      sessionStorage.setItem("orderID", orderResponse.data.orderID);

  
      if (!orderResponse?.data?.orderID) {
        throw new Error("Order ID is undefined. Check API response.");
      }
  
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to initialize.");
        return;
      }
  
      console.log("Sending request to /api/stripe", {
        totalAmount: orderData.totalAmount,
        orderID: orderResponse.data.orderID,
      });
  
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: orderResponse.data.totalAmount,
          orderID: orderResponse.data.orderID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment failed");
      }
  
      const data = await response.json();
      if (!data.sessionId) {
        throw new Error("Invalid response from server");
      }
  
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalAmount * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.productID} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name || `Product ${item.productID}`}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name || `Product ${item.productID}`}</h3>
                  <p className="text-sm text-gray-500">${item.totalAmount.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateQuantity(item.productID, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateQuantity(item.productID, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => handleRemoveItem(item.productID)}>
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-4">Your cart is empty</p>
              <Button onClick={() => window.location.href = '/shop'}>Continue Shopping</Button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button 
              onClick={() => router.push('/informCustomer')}
              className="w-full"
            >
              Enter Information
            </Button>
            <Button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}