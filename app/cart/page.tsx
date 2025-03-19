"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchCartByUserId, updateCartItem, removeFromCart } from "@/app/api/cartApi"

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
  const [userId, setUserId] = useState("user123") // Temporary userId, should be from auth system
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCartItems()
  }, [userId])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetchCartByUserId(userId)
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
      await updateCartItem(userId, productId, newQuantity)
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
      await removeFromCart(userId, productId)
      setCartItems(prev => prev.filter(item => item.productId !== productId))
    } catch (error) {
      console.error("Error removing item:", error)
      alert("Failed to remove item")
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  if (loading) {
    return <div className="container py-8">Loading cart...</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
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
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button onClick={() => window.location.href = '/shop'}>Continue Shopping</Button>
        </div>
      )}
    </div>
  )
}
