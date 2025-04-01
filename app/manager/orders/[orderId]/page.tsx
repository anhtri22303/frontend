"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Order, fetchOrderByID } from "@/app/api/orderApi"

interface OrderDetailsProps {
  params: {
    orderId: string
  }
}

export default function OrderDetails({ params }: OrderDetailsProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (params.orderId) {
      loadOrderDetails()
    }
  }, [params.orderId])

  const loadOrderDetails = async () => {
    try {
      const data = await fetchOrderByID(params.orderId);
      console.log("Order data:", data); // Kiểm tra dữ liệu trả về
      setOrder(data);
    } catch (error) {
      console.error("Error loading order details:", error);
    }
  };

  if (!params.orderId) {
    return <div>Invalid Order ID</div>
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.orderID}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer ID</p>
              <p className="font-medium">{order.customerID || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium">Product ID</th>
                  <th className="p-4 text-left font-medium">Quantity</th>
                  <th className="p-4 text-left font-medium">Price</th>
                  <th className="p-4 text-left font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails?.map((detail) => (
                  <tr key={detail.productID} className="border-b">
                  <td className="p-4">{detail.productID}</td>
                  <td className="p-4">{detail.quantity}</td>
                  <td className="p-4">
                    ${detail.price ? detail.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-4">
                    ${detail.price ? (detail.quantity * detail.price).toFixed(2) : "0.00"}
                  </td>
                </tr>
                ))}
                <tr>
                  <td colSpan={3} className="p-4 text-right font-medium">
                    Total Amount:
                  </td>
                  <td className="p-4 font-medium">
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}