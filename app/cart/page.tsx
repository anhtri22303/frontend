"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { fetchCartByUserId, updateCartItem, removeFromCart } from "@/app/api/cartApi"
import stripePromise from '@/lib/stripe-client'
import { createOrder } from "@/app/api/orderApi"

interface CartItem {
  productId: string
  quantity: number
  price: number
  name?: string
  image?: string
}

interface Cart {
  userId: string
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      // Handle case when userId is not found in localStorage
      console.error("User ID not found in localStorage")
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadCartItems()
    }
  }, [userId])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetchCartByUserId(userId!)
      if (response && response.items) {
        setCartItems(response.items)
      }
    } catch (error) {
      console.error("Error loading cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItem(userId!, productId, newQuantity)
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(userId!, productId)
      setCartItems(prev => prev.filter(item => item.productId !== productId))
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Failed to remove item")
    }
  }

  // In your cart page, modify the handleCheckout function:
  
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const userId = localStorage.getItem("userId");
      
      // Create order data
      const orderData = {
        customerID: userId!,
        orderDate: new Date().toISOString(),
        status: "PENDING",
        payment: "STRIPE",
        amount: total,
        details: cartItems.map(item => ({
          productID: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };
  
      // Create order first
      const orderResponse = await createOrder(orderData);
      
      if (!orderResponse) {
        throw new Error('Failed to create order');
      }
  
      // Then proceed with Stripe payment
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');
  
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId: orderResponse.orderID // Include order ID in stripe payment
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }
  
      const data = await response.json();
      if (!data.sessionId) {
        throw new Error('Invalid response from server');
      }
  
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.productId} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name || `Product ${item.productId}`}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name || `Product ${item.productId}`}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => handleRemoveItem(item.productId)}>
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