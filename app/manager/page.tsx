"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, Users, Star, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts } from "@/app/api/productApi";
import { fetchOrders } from "@/app/api/orderApi";
import { fetchStaffAndManagers } from "@/app/api/userManagerApi";
import { fetchPromotions } from "@/app/api/promotionApi";
import { fetchCustomers } from "@/app/api/userManagerApi";
import { fetchFeedbacks } from "@/app/api/feedbackApi";

export default function ManagerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [staffAndManagers, setStaffAndManagers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData, staffData, customersData, feedbacksData, promotionsData] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchStaffAndManagers(),
          fetchCustomers(),
          fetchFeedbacks(),
          fetchPromotions(),
        ]);
        setProducts(productsData || []);
        setOrders(ordersData || []);
        setPendingOrders(ordersData.filter((order) => order.status === "PENDING"));
        setCompletedOrders(ordersData.filter((order) => order.status === "COMPLETED"));
        setStaffAndManagers(staffData?.data || []);
        setCustomers(customersData?.data || []);
        setFeedbacks(feedbacksData || []);
        setPromotions(promotionsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  // Pagination logic
  const paginate = (orders, page) => {
    const startIndex = (page - 1) * ordersPerPage;
    return orders.slice(startIndex, startIndex + ordersPerPage);
  };

  const pendingOrdersToShow = paginate(pendingOrders, pendingPage);
  const completedOrdersToShow = paginate(completedOrders, completedPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOrders.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Order ID</th>
                      <th className="p-4 text-left font-medium">Customer ID</th>
                      <th className="p-4 text-left font-medium">Order Date</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrdersToShow.map((order) => (
                      <tr key={order.orderID} className="border-b">
                        <td className="p-4">{order.orderID}</td>
                        <td className="p-4">{order.customerID || "N/A"}</td>
                        <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPendingPage((prev) => Math.max(prev - 1, 1))}
                    disabled={pendingPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {pendingPage} of {Math.ceil(pendingOrders.length / ordersPerPage)}
                  </span>
                  <button
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                    onClick={() =>
                      setPendingPage((prev) =>
                        Math.min(prev + 1, Math.ceil(pendingOrders.length / ordersPerPage))
                      )
                    }
                    disabled={pendingPage === Math.ceil(pendingOrders.length / ordersPerPage)}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No pending orders available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {completedOrders.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Order ID</th>
                      <th className="p-4 text-left font-medium">Customer ID</th>
                      <th className="p-4 text-left font-medium">Order Date</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrdersToShow.map((order) => (
                      <tr key={order.orderID} className="border-b">
                        <td className="p-4">{order.orderID}</td>
                        <td className="p-4">{order.customerID || "N/A"}</td>
                        <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setCompletedPage((prev) => Math.max(prev - 1, 1))}
                    disabled={completedPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {completedPage} of {Math.ceil(completedOrders.length / ordersPerPage)}
                  </span>
                  <button
                    className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                    onClick={() =>
                      setCompletedPage((prev) =>
                        Math.min(prev + 1, Math.ceil(completedOrders.length / ordersPerPage))
                      )
                    }
                    disabled={completedPage === Math.ceil(completedOrders.length / ordersPerPage)}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No completed orders available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}