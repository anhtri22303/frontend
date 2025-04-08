"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order, OrderDetail } from "@/app/api/orderCustomerApi";
import { fetchOrderByIdForUser } from "@/app/api/orderCustomerApi";
import toast from "react-hot-toast";
import stripePromise from "@/lib/stripe-client";

interface OrderDetailsProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetails({ params }: OrderDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (params.orderId) {
      loadOrderDetails();
    }
  }, [params.orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const userID = localStorage.getItem("userID");
      
      if (!userID) {
        toast.error("You need to be logged in to view orders.");
        router.push("/login");
        return;
      }
      
      const data = await fetchOrderByIdForUser(userID, params.orderId);
      console.log("Fetched order:", data);
      
      // If totalAmount is missing, calculate it from orderDetails
      if (data && !data.totalAmount && data.orderDetails) {
        const calculatedTotal = data.orderDetails.reduce(
          (sum, detail) => sum + detail.quantity * detail.totalAmount,
          0
        );
        data.totalAmount = calculatedTotal;
      }
      
      setOrder(data);
    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle payment for a pending order
  const handlePayOrder = async () => {
    if (!order) return;
    
    try {
      setIsProcessingPayment(true);
      const userID = localStorage.getItem("userID");
      
      if (!userID) {
        toast.error("User ID not found. Please log in.");
        return;
      }

      // Store the order ID in session storage for reference after payment
      sessionStorage.setItem("orderID", order.orderID);

      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to initialize.");
        return;
      }

      // Use the discountedTotalAmount if available, otherwise use totalAmount
      const amountToCharge = order.discountedTotalAmount || order.totalAmount;

      console.log("Sending request to /api/stripe", {
        totalAmount: amountToCharge,
        orderID: order.orderID,
      });

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: amountToCharge,
          orderID: order.orderID,
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

      toast.success("Redirecting to payment...");
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Function to render payment badge based on payment method
  const renderPaymentBadge = (payment: string | undefined) => {
    if (!payment) return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">N/A</span>;
    
    switch(payment.toUpperCase()) {
      case 'Stripe':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Stripe</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">{payment}</span>;
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading order details...</div>;
  }

  if (!params.orderId) {
    return <div className="p-6">Invalid Order ID</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Order Information</h2>
            
            {/* Add Pay Order button only if status is PENDING */}
            {order.status === "PENDING" && (
              <Button 
                onClick={handlePayOrder}
                disabled={isProcessingPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessingPayment ? "Processing..." : "Pay Order"}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.orderID}</p>
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
          
          {/* Add Pay Now notification for pending orders */}
          {order.status === "PENDING" && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                This order requires payment. Please click the "Pay Order" button to complete your purchase.
              </p>
            </div>
          )}
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