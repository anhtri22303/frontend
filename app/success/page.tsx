"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateOrder } from "@/app/api/orderApi";
import { fetchOrderDetailsByUserID, Order, OrderDetail } from "@/app/api/orderCustomerApi";
import toast from "react-hot-toast";
import { CreditCard, Tag } from "lucide-react";

// Cập nhật interface để phản ánh cấu trúc mới
interface OrderInfo {
  orderID?: string;
  customerID?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  orderDate?: string;
  status?: string;
  totalAmount?: number;
  discountedTotalAmount?: number;
  payment?: string;
  promotion?: string;
  orderDetails?: {
    productID: string;
    productName?: string;
    quantity: number;
    productPrice?: number;
    discountName?: string;
    discountPercentage?: number;
    totalAmount: number;
    discountedTotalAmount?: number;
    image?: string;
  }[];
}

export default function SuccessPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderID = sessionStorage.getItem("orderID");
    const userID = localStorage.getItem("userID");
    if (orderID && userID) {
      fetchOrderData(userID, orderID);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrderData = async (userID: string, orderID: string) => {
    try {
      const orderData = await fetchOrderDetailsByUserID(userID, orderID);
      console.log("API Response:", orderData);
      if (orderData && orderData.data) {
        setOrderInfo({
          orderID: orderData.data.orderID,
          customerID: orderData.data.customerID,
          customerInfo: orderData.data.customerInfo,
          orderDate: orderData.data.orderDate,
          status: orderData.data.status,
          totalAmount: orderData.data.totalAmount,
          discountedTotalAmount: orderData.data.discountedTotalAmount,
          payment: orderData.data.payment,
          promotion: orderData.data.promotion,
          orderDetails: orderData.data.orderDetails,
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = async () => {
    try {
      const orderID = orderInfo.orderID;
      if (!orderID) {
        toast.error("Order ID not found.");
        return;
      }

      await updateOrder(orderID, "COMPLETED");
      toast.success("Order status updated to COMPLETED!");

      sessionStorage.removeItem("orderID");
      router.push("/shop");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID:</p>
              <p className="font-medium">{orderInfo.orderID || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date:</p>
              <p className="font-medium">
                {orderInfo.orderDate ? new Date(orderInfo.orderDate).toLocaleDateString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status:</p>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  orderInfo.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : orderInfo.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : orderInfo.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {orderInfo.status || '-'}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method:</p>
              <div className="flex items-center gap-1 mt-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                {renderPaymentBadge(orderInfo.payment)}
              </div>
            </div>
          </div>

          {orderInfo.promotion && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Order Promotion:</p>
              <div className="flex items-center gap-1 mt-1">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  {orderInfo.promotion}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6">
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
            {orderInfo.orderDetails?.map((item) => (
              <div key={item.productID} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.productName || "Product"}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.productName || item.productID}</h3>
                  <div>
                    {item.productPrice && (
                      <p className="text-gray-600">
                        ${item.productPrice.toFixed(2)} x {item.quantity}
                      </p>
                    )}
                    {item.discountPercentage && (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {item.discountPercentage}% {item.discountName ? `(${item.discountName})` : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {item.discountedTotalAmount ? (
                    <>
                      <p className="font-medium text-green-600">${item.discountedTotalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 line-through">${item.totalAmount.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="font-medium">${item.totalAmount.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span>${orderInfo.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>

            {orderInfo.discountedTotalAmount && (
              <div className="flex justify-between pt-2 font-semibold text-green-600">
                <span>Discounted Total</span>
                <span>${orderInfo.discountedTotalAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={handleContinueShopping} className="px-8 bg-green-600 hover:bg-green-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}