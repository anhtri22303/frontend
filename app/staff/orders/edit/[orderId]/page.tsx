"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchOrderByID, updateOrder } from "@/app/api/orderApi"

export default function EditOrderPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState({
    customerID: "",
    orderDate: "",
    status: "",
    payment: "",
    amount: 0
  })

  useEffect(() => {
    loadOrder()
  }, [])

  const loadOrder = async () => {
    try {
      const data = await fetchOrderByID(params.orderId)
      setOrder(data)
    } catch (error) {
      console.error("Error loading order:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateOrder(params.orderId, order)
      router.push("/staff/orders")
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Order #{params.orderId}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium mb-1 block">Customer ID</label>
          <Input
            value={order.customerID}
            onChange={(e: { target: { value: any } }) => setOrder({ ...order, customerID: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Order Date</label>
          <Input
            type="date"
            value={order.orderDate}
            onChange={(e: { target: { value: any } }) => setOrder({ ...order, orderDate: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select value={order.status} onValueChange={(value) => setOrder({ ...order, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Payment Method</label>
          <Input
            value={order.payment}
            onChange={(e: { target: { value: any } }) => setOrder({ ...order, payment: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Amount</label>
          <Input
            type="number"
            value={order.amount}
            onChange={(e: { target: { value: any } }) => setOrder({ ...order, amount: Number(e.target.value) })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Save Changes</Button>
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}