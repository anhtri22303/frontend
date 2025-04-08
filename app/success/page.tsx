"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateOrder } from "@/app/api/orderApi";
import { fetchOrderDetailsByUserID, Order, OrderDetail } from "@/app/api/orderCustomerApi";
import toast from "react-hot-toast";
import { CreditCard, Tag, CheckCircle, ShoppingBag } from "lucide-react";

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
    name?: string;
    quantity: number;
    productPrice?: number;
    discountName?: string;
    discount?: number;
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
      if (orderData && orderData.data) {
        // Tính toán lại totalAmount và discountedTotalAmount dựa trên orderDetails
        const orderDetails = orderData.data.orderDetails || [];
        const calculatedTotalAmount = orderDetails.reduce(
          (sum: number, item: any) => sum + (item.productPrice || 0) * (item.quantity || 0),
          0
        );
        const calculatedDiscountedTotalAmount = orderDetails.reduce(
          (sum: number, item: any) => {
            if (item.discount && item.discount > 0 && item.productPrice) {
              const discountedPrice = item.productPrice * (1 - item.discount / 100);
              return sum + discountedPrice * (item.quantity || 0);
            }
            return sum + (item.productPrice || 0) * (item.quantity || 0);
          },
          0
        );

        // Cập nhật orderDetails để thêm discountedPrice cho từng sản phẩm
        const updatedOrderDetails = orderDetails.map((item: any) => {
          if (item.discount && item.discount > 0 && item.productPrice) {
            const discountedPrice = item.productPrice * (1 - item.discount / 100);
            return {
              ...item,
              discountedPrice: discountedPrice,
              discountedTotalAmount: discountedPrice * (item.quantity || 0),
            };
          }
          return {
            ...item,
            discountedPrice: item.productPrice,
            discountedTotalAmount: (item.productPrice || 0) * (item.quantity || 0),
          };
        });

        setOrderInfo({
          orderID: orderData.data.orderID,
          customerID: orderData.data.customerID,
          customerInfo: orderData.data.customerInfo,
          orderDate: orderData.data.orderDate,
          status: orderData.data.status,
          totalAmount: calculatedTotalAmount,
          discountedTotalAmount:
            calculatedDiscountedTotalAmount < calculatedTotalAmount
              ? calculatedDiscountedTotalAmount
              : undefined, // Chỉ hiển thị nếu có giảm giá
          payment: orderData.data.payment,
          promotion: orderData.data.promotion,
          orderDetails: updatedOrderDetails,
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

  const handleViewOrderHistory = () => {
    router.push("/orders");
  };

  const renderPaymentBadge = (payment: string | undefined) => {
    if (!payment) return <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">N/A</span>;

    switch (payment.toUpperCase()) {
      case "STRIPE":
        return <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Stripe</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">{payment}</span>;
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header Section */}
      <div className="text-center mb-10">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Successful!</h1>
        <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      {/* Order Information Section */}
      <div className="bg-white shadow-md rounded-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <CreditCard className="h-6 w-6 text-gray-500 mr-2" />
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-lg font-medium text-gray-800">{orderInfo.orderID || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="text-lg font-medium text-gray-800">
              {orderInfo.orderDate ? new Date(orderInfo.orderDate).toLocaleDateString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                orderInfo.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : orderInfo.status === "PROCESSING"
                  ? "bg-blue-100 text-blue-800"
                  : orderInfo.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {orderInfo.status || "-"}
            </span>
          </div>
        </div>

        {orderInfo.promotion && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Promotion Applied</p>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                {orderInfo.promotion}
              </span>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base">{orderInfo.customerInfo?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base">{orderInfo.customerInfo?.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base">{orderInfo.customerInfo?.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base">{orderInfo.customerInfo?.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white shadow-md rounded-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <ShoppingBag className="h-6 w-6 text-gray-500 mr-2" />
          Order Summary
        </h2>
        <div className="space-y-6">
          {orderInfo.orderDetails?.map((item) => (
            <div
              key={item.productID}
              className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-b-0"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name || "Product"}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-800">{item.name || item.productID}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {item.discount && item.discount > 0 && item.productPrice ? (
                    <>
                      <p className="text-gray-600 line-through">
                        ${item.productPrice.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ${(item.productPrice * (1 - item.discount / 100)).toFixed(2)} x {item.quantity}
                      </p>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {item.discount}% {item.discountName ? `(${item.discountName})` : ""}
                      </span>
                    </>
                  ) : (
                    item.productPrice && (
                      <p className="text-gray-600">
                        ${item.productPrice.toFixed(2)} x {item.quantity}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ${item.discountedTotalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total</span>
              <span>${orderInfo.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
            {orderInfo.discountedTotalAmount && (
              <div className="flex justify-between text-lg font-semibold text-green-600 mt-2">
                <span>Discounted Total</span>
                <span>${orderInfo.discountedTotalAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button
          onClick={handleContinueShopping}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300"
        >
          Continue Shopping
        </Button>
        {/* <Button
          onClick={handleViewOrderHistory}
          variant="outline"
          className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
        >
          View Order History
        </Button> */}
      </div>
    </div>
  );
}