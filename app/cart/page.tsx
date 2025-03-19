"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchCart, updateCart, deleteCartItem } from "@/app/api/cartApi"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const data = await fetchCart()
        setCartItems(data)
      } catch (error) {
        console.error("Error loading cart items:", error)
      }
    }

    loadCartItems()
  }, [])

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCart(id, newQuantity)
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    } catch (error) {
      console.error("Error updating cart item:", error)
    }
  }

  const removeItem = async (id: string) => {
    try {
      await deleteCartItem(id)
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing cart item:", error)
    }
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal - discount + shipping

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => removeItem(item.id)}>
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
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <Input
                type="text"
                placeholder="Promo Code"
                value={promoCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                className="mb-2"
              />
              <Button onClick={applyPromoCode} className="w-full">
                Apply Promo Code
              </Button>
            </div>

            <Button className="w-full mt-4" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button>Continue Shopping</Button>
        </div>
      )}
    </div>
  )
}

