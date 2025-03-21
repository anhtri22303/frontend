"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchOrderDetails } from "@/app/api/orderApi";

interface OrderInfo {
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  orderID?: string;
  orderDetails?: {
    productID: string;
    name?: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  totalAmount?: number;
}

export default function SuccessPage() {
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderID = sessionStorage.getItem("orderID");
    const userID = localStorage.getItem("userID"); // Lấy orderID từ sessionStorage
    if (orderID) {
      fetchOrderData(userID!,orderID);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrderData = async (userID: string, orderID: string) => {
    try {
      const orderData = await fetchOrderDetails(userID, orderID);
      console.log("API Response:", orderData);
      if (orderData && orderData.data) {
        setOrderInfo({
          orderID: orderData.data.orderID,
          customerInfo: orderData.data.customerInfo,
          orderDetails: orderData.data.orderDetails,
          totalAmount: orderData.data.totalAmount,
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    sessionStorage.removeItem("orderID");
    router.push("/shop");
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
            {orderInfo.orderDetails?.map((item) => (
              <div key={item.productID} className="flex items-center space-x-4 border-b pb-4">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name || "Product"}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-medium">{item.name || "Product"}</h3>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span>${orderInfo.totalAmount?.toFixed(2) || "0.00"}</span>
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
  );
}
