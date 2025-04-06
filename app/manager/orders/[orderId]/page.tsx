"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Tag, CreditCard } from "lucide-react"

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
      const data = await fetchOrderByID(params.orderId)
      // Log the data to debug
      console.log("Fetched order:", data);
      // If totalAmount is missing, calculate it from orderDetails
      if (data && !data.totalAmount && data.orderDetails) {
        const calculatedTotal = data.orderDetails.reduce(
          (sum, detail) => sum + detail.quantity * detail.totalAmount,
          0
        );
        data.totalAmount = calculatedTotal;
      }
      setOrder(data)
    } catch (error) {
      console.error("Error loading order details:", error)
    }
  }

  // Function to render payment badge based on payment method
  const renderPaymentBadge = (payment: string | undefined) => {
    if (!payment) return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">N/A</span>;
    
    switch(payment.toUpperCase()) {
      case 'COD':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Cash on Delivery</span>;
      case 'CREDIT_CARD':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Credit Card</span>;
      case 'BANK_TRANSFER':
        return <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">Bank Transfer</span>;
      case 'PAYPAL':
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">PayPal</span>;
      case 'MOMO':
        return <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">MoMo</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{payment}</span>;
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.orderID}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer ID</p>
              <p className="font-medium">{order.customerID || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium">{order.customerName || "N/A"}</p>
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
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-1 mt-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {renderPaymentBadge(order.payment)}
              </div>
            </div>
            {order.promotion && (
              <div>
                <p className="text-sm text-muted-foreground">Order Promotion</p>
                <div className="flex items-center gap-1 mt-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    {order.promotion}
                  </span>
                </div>
              </div>
            )}
            {/* Show discounted total if available */}
            {order.discountedTotalAmount && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Discounted Total
                </p>
                <p className="font-medium text-green-600">
                  ${order.discountedTotalAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium">Product</th>
                  <th className="p-4 text-left font-medium">Quantity</th>
                  <th className="p-4 text-left font-medium">Price</th>
                  <th className="p-4 text-left font-medium">Discount Price</th>
                  <th className="p-4 text-left font-medium">
                    Discounted Total
                  </th>
                  <th className="p-4 text-left font-medium">Promotion</th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails?.map((detail) => (
                  <tr key={detail.productID} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">
                          {detail.productName || detail.productID}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {detail.productID}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{detail.quantity}</td>
                    <td className="p-4">
                      $
                      {detail.productPrice
                        ? detail.productPrice.toFixed(2)
                        : detail.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {detail.productPrice && detail.discountPercentage ? (
                        <span className="text-green-600">
                          $
                          {(
                            detail.productPrice -
                            detail.productPrice *
                              (detail.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {detail.discountedTotalAmount ? (
                        <span className="text-green-600">
                          ${detail.discountedTotalAmount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {detail.discountPercentage ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {detail.discountPercentage}%{" "}
                          {detail.discountName
                            ? `(${detail.discountName})`
                            : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="p-4 text-right font-medium">
                    Total Amount:
                  </td>
                  <td className="p-4 font-medium">
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                  </td>
                  <td className="p-4"></td>
                </tr>
                {order.discountedTotalAmount && (
                  <tr className="bg-green-50">
                    <td colSpan={4} className="p-4 text-right font-medium">
                      Discounted Total:
                    </td>
                    <td className="p-4 font-medium text-green-600">
                      ${order.discountedTotalAmount.toFixed(2)}
                    </td>
                    <td className="p-4"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}