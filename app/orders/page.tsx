"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchOrdersByUserID } from "@/app/api/orderCustomerApi";
import toast from "react-hot-toast";

// Updated Order interface to include the new fields
interface Order {
  orderID: string;
  customerID: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  discountedTotalAmount: number; // New field
  paymentMethodType: string; // New field
  paymentBrand: string; // New field
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userID = localStorage.getItem("userID"); // Lấy userID từ localStorage
    if (!userID) {
      toast.error("User not logged in. Please log in to view your orders.");
      router.push("/login");
      return;
    }
    loadOrders(userID);
  }, [router]);

  const loadOrders = async (userID: string) => {
    setIsLoading(true);
    try {
      const response = await fetchOrdersByUserID(userID);
      console.log("Orders fetched:", response.data);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Order not found.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">My Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border shadow-lg bg-white overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm border-b">
              <th className="p-4 text-left font-semibold">Order ID</th>
              <th className="p-4 text-left font-semibold">Order Date</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Total Amount</th>
              <th className="p-4 text-left font-semibold">Discounted Total</th>
              <th className="p-4 text-left font-semibold">Payment Method</th>
              <th className="p-4 text-left font-semibold">Payment Brand</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.orderID}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-700">{order.orderID}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
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
                  </td>
                  <td className="p-4 text-gray-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-700">
                    ${order.discountedTotalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {order.paymentMethodType || "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {order.paymentBrand || "N/A"}
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 w-9 p-0 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white shadow-md">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(order.orderID)}
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}