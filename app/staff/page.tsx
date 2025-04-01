"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, HelpCircle, Tag, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/app/api/productApi";
import { fetchQuizzes } from "@/app/api/quizApi";
import { fetchPromotions } from "@/app/api/promotionApi";
import { fetchOrders } from "@/app/api/orderApi";


// Interfaces for data
interface Product {
  productID: string;
  productName: string;
  category: string;
  price: number;
}


interface Quiz {
  questionId: string;
  quizText: string;
}


interface Promotion {
  productID: string;
  discount: number;
  startDate: string;
  endDate: string;
}


interface Order {
  orderID: string
  customerID: string | null
  orderDate: string
  status: string
  totalAmount: number
}




export default function StaffDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch products
  const fetchProductsData = async () => {
    try {
      const productsData = await fetchProducts();
      console.log("1", productsData)
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  // Fetch quizzes
  const fetchQuizzesData = async () => {
    try {
      const quizzesData = await fetchQuizzes();
      setQuizzes(quizzesData || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };


  // Fetch promotions
  const fetchPromotionsData = async () => {
    try {
      const promotionsData = await fetchPromotions();
      setPromotions(promotionsData || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };


  // Fetch orders
  const fetchOrdersData = async () => {
    try {
      const ordersData = await fetchOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  // Call APIs separately
  useEffect(() => {
    fetchProductsData();
  }, []);


  useEffect(() => {
    fetchQuizzesData();
  }, []);


  useEffect(() => {
    fetchPromotionsData();
  }, []);


  useEffect(() => {
    fetchOrdersData();
  }, []);


  const handleSearch = () => {
    // Placeholder for search functionality
    // In a real implementation, this could filter products, quizzes, etc.
    console.log("Searching for:", searchQuery);
  };


  const activePromotions = promotions.filter((promo) => {
    const currentDate = new Date().toISOString().split("T")[0];
    return promo.startDate <= currentDate && promo.endDate >= currentDate;
  });


  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, quizzes..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>


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
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
            <Button
              variant="link"
              className="p-0 text-sm text-muted-foreground"
              onClick={() => router.push("/staff/quizzes")}
            >
              View all quizzes
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePromotions.length}</div>
            <Button
              variant="link"
              className="p-0 text-sm text-muted-foreground"
              onClick={() => router.push("/staff/promotions")}
            >
              View all promotions
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


      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/staff/products/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button onClick={() => router.push("/staff/quizzes/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
          <Button onClick={() => router.push("/staff/promotions/create")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Promotion
          </Button>
        </div>
      </div>


      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <ul className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <li key={product.productID} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/staff/products/${product.productID}/edit`)}
                    >
                      Edit
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent products available.</p>
            )}
          </CardContent>
        </Card>


        {/* Recent Quizzes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {quizzes.length > 0 ? (
              <ul className="space-y-4">
                {quizzes.slice(0, 5).map((quiz) => (
                  <li key={quiz.questionId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quiz.quizText}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/staff/quizzes/${quiz.questionId}/edit`)}
                    >
                      Edit
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent quizzes available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
