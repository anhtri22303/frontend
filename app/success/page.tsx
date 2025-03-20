"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface OrderInfo {
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
    address?: string
  }
  orderID?: string
  cartItems?: {
    productID: string
    name?: string
    totalAmount: number
    quantity: number
    image?: string
  }[]
  totalAmount?: number
}

export default function SuccessPage() {
  const router = useRouter()
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({})

  useEffect(() => {
    const info = sessionStorage.getItem("orderInfo")
    if (info) {
      setOrderInfo(JSON.parse(info))
    }
  }, [])

  const handleContinueShopping = () => {
    sessionStorage.removeItem("orderInfo")
    router.push("/shop")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <p className="text-gray-600">Order ID: {orderInfo.orderID || '-'}</p>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Customer Details:</h3>
            <p>Name: {orderInfo.customerInfo?.name || '-'}</p>
            <p>Email: {orderInfo.customerInfo?.email || '-'}</p>
            <p>Phone: {orderInfo.customerInfo?.phone || '-'}</p>
            <p>Address: {orderInfo.customerInfo?.address || '-'}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderInfo.cartItems?.map((item) => (
              <div key={item.productID} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name || 'Product'}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name || 'Product'}</h3>
                  <p className="text-gray-600">
                    ${item.totalAmount.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(item.totalAmount * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <div className="flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span>${orderInfo.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={handleContinueShopping} className="px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}