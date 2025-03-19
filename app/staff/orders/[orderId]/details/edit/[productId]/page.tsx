"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchOrderDetails, updateOrderDetail } from "@/app/api/orderApi"

export default function EditOrderDetailPage({ 
  params 
}: { 
  params: { orderId: string; productId: string } 
}) {
  const router = useRouter()
  const [detail, setDetail] = useState({
    productID: "",
    quantity: 0,
    price: 0
  })

  useEffect(() => {
    loadOrderDetail()
  }, [])

  const loadOrderDetail = async () => {
    try {
      const details = await fetchOrderDetails(params.orderId)
      const currentDetail = details.find((d: { productID: string }) => d.productID === params.productId)
      if (currentDetail) {
        setDetail(currentDetail)
      }
    } catch (error) {
      console.error("Error loading order detail:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateOrderDetail(params.orderId, params.productId, detail)
      router.push(`/staff/orders/${params.orderId}`)
    } catch (error) {
      console.error("Error updating order detail:", error)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Order Detail</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium mb-1 block">Product ID</label>
          <Input
            value={detail.productID}
            disabled
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Quantity</label>
          <Input
            type="number"
            min="1"
            value={detail.quantity}
            onChange={(e: { target: { value: any } }) => setDetail({ ...detail, quantity: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Price</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={detail.price}
            onChange={(e: { target: { value: any } }) => setDetail({ ...detail, price: Number(e.target.value) })}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Button type="submit">Save Changes</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}