"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts } from "@/app/api/productApi";
import { fetchOrders } from "@/app/api/orderApi";
import { fetchStaffAndManagers } from "@/app/api/userManagerApi";
import { fetchCustomers } from "@/app/api/userManagerApi";
import { fetchFeedbacks } from "@/app/api/feedbackApi";
import { fetchPromotions } from "@/app/api/promotionApi";
import { fetchRoutines } from "@/app/api/routineApi";

interface Product {
  productID: string;
  productName: string;
  category: string;
  price: number;
}

interface Order {
  orderID: string;
  customerID: string | null;
  orderDate: string;
  status: string;
  totalAmount: number;
}

interface User {
  userID: string;
  fullName: string;
  role: string;
  email: string;
}

interface Feedback {
  rating: number;
}

interface Promotion {
  promotionID: string;
  promotionName: string;
  discount: number;
  startDate?: string;
  endDate?: string;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffAndManagers, setStaffAndManagers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData, staffData, customersData, feedbacksData, promotionsData, routinesData] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchStaffAndManagers(),
          fetchCustomers(),
          fetchFeedbacks(),
          fetchPromotions(),
          fetchRoutines()
        ]);
        setProducts(productsData || []);
        setOrders(ordersData || []);
        setStaffAndManagers(staffData?.data || []);
        setCustomers(customersData?.data || []);
        setFeedbacks(feedbacksData || []);
        setPromotions(promotionsData || []);
        setRoutines(routinesData?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Chart Data Calculations
  const productCategoryData = Object.entries(
    products.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  const orderStatusChartData = Object.entries(
    orders.reduce((acc: Record<string, number>, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));

  const userRolesData = [
    { role: "STAFF", count: staffAndManagers.filter((user) => user.role === "STAFF").length },
    { role: "MANAGER", count: staffAndManagers.filter((user) => user.role === "MANAGER").length },
    { role: "CUSTOMER", count: customers.length },
  ];

  const feedbackRatingsChartData = Object.entries(
    feedbacks.reduce((acc: Record<number, number>, feedback) => {
      acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
      return acc;
    }, {})
  ).map(([rating, count]) => ({ rating: `Rating ${rating}`, count }));

  if (loading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <Button
              variant="link"
              className="p-0 text-sm text-muted-foreground"
              onClick={() => router.push("/staff/products")}
            >
              View all products
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <Button
              variant="link"
              className="p-0 text-sm text-muted-foreground"
              onClick={() => router.push("/staff/orders")}
            >
              View all orders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {productCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productCategoryData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No product data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusChartData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {orderStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No order data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {userRolesData.some(data => data.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRolesData}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No user data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbackRatingsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackRatingsChartData}>
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No feedback data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff and Managers</CardTitle>
          </CardHeader>
          <CardContent>
            {staffAndManagers.length > 0 ? (
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Role</th>
                    <th className="border-b py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {staffAndManagers.map((user) => (
                    <tr key={user.userID}>
                      <td className="py-2">{user.fullName || "N/A"}</td>
                      <td className="py-2">{user.role || "N/A"}</td>
                      <td className="py-2">{user.email || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No staff or managers data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            {promotions.length > 0 ? (
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Promotion Name</th>
                    <th className="border-b py-2">Discount</th>
                    <th className="border-b py-2">Start Date</th>
                    <th className="border-b py-2">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion.promotionID}>
                      <td className="py-2">{promotion.promotionName || "N/A"}</td>
                      <td className="py-2">{promotion.discount ? `${promotion.discount}%` : "N/A"}</td>
                      <td className="py-2">{promotion.startDate || "-"}</td>
                      <td className="py-2">{promotion.endDate || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No promotions data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}