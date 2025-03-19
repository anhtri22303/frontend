"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Package, ShoppingCart, Users, X, ChevronDown, Sparkles, Droplets, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  YAxis,
  AreaChart,
} from "recharts"
import { ResponsiveContainer } from "recharts"
import { XAxis } from "recharts"

export default function SkincareDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sample data for charts
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
  ]

  const routineData = [
    { name: "Cleansers", value: 35 },
    { name: "Toners", value: 20 },
    { name: "Serums", value: 25 },
    { name: "Moisturizers", value: 15 },
    { name: "Sunscreens", value: 5 },
  ]

  const customerAgeData = [
    { name: "18-24", value: 20 },
    { name: "25-34", value: 35 },
    { name: "35-44", value: 25 },
    { name: "45-54", value: 15 },
    { name: "55+", value: 5 },
  ]

  const productPerformanceData = [
    { name: "Vitamin C Serum", sales: 1200, reviews: 4.8 },
    { name: "Hyaluronic Acid", sales: 980, reviews: 4.7 },
    { name: "Retinol Cream", sales: 850, reviews: 4.5 },
    { name: "Niacinamide", sales: 760, reviews: 4.6 },
    { name: "AHA/BHA Peel", sales: 650, reviews: 4.4 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Skincare Analytics Dashboard</h1>
                <p className="text-muted-foreground">Monitor your skincare product performance and customer routines</p>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <span>This Month</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Today</DropdownMenuItem>
                    <DropdownMenuItem>This Week</DropdownMenuItem>
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>This Quarter</DropdownMenuItem>
                    <DropdownMenuItem>This Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button>Export Report</Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$78,650.40</div>
                  <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,842</div>
                  <p className="text-xs text-muted-foreground">+22.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Routine Completions</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,583</div>
                  <p className="text-xs text-muted-foreground">+8.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$64.75</div>
                  <p className="text-xs text-muted-foreground">+4.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Sales Trend Chart */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Sales Trend</CardTitle>
                  <CardDescription>Product sales performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Routine Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Routine Product Distribution</CardTitle>
                  <CardDescription>Most popular products in routines</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={routineData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {routineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Customer Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Age Demographics</CardTitle>
                  <CardDescription>Distribution of customers by age group</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customerAgeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#00C49F">
                        {customerAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* AM/PM Routine Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Routine Completion Rates</CardTitle>
                  <CardDescription>AM vs PM skincare routine adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="am" className="h-80">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="am" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        AM Routine
                      </TabsTrigger>
                      <TabsTrigger value="pm" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        PM Routine
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="am" className="h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { day: "Mon", completion: 78 },
                            { day: "Tue", completion: 82 },
                            { day: "Wed", completion: 75 },
                            { day: "Thu", completion: 80 },
                            { day: "Fri", completion: 72 },
                            { day: "Sat", completion: 68 },
                            { day: "Sun", completion: 65 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="completion" stroke="#FFBB28" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="pm" className="h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { day: "Mon", completion: 85 },
                            { day: "Tue", completion: 88 },
                            { day: "Wed", completion: 82 },
                            { day: "Thu", completion: 86 },
                            { day: "Fri", completion: 90 },
                            { day: "Sat", completion: 92 },
                            { day: "Sun", completion: 89 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="completion" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Top Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best selling skincare products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vitamin C Brightening Serum</TableCell>
                      <TableCell>Serums</TableCell>
                      <TableCell>1,245</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">4.8</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles key={i} className={`h-3 w-3 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          In Stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">$49,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Hyaluronic Acid Hydrating Toner</TableCell>
                      <TableCell>Toners</TableCell>
                      <TableCell>982</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">4.7</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles key={i} className={`h-3 w-3 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          In Stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">$29,460</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Retinol Night Repair Cream</TableCell>
                      <TableCell>Moisturizers</TableCell>
                      <TableCell>854</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">4.5</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles key={i} className={`h-3 w-3 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Low Stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">$42,700</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Niacinamide 10% + Zinc 1%</TableCell>
                      <TableCell>Serums</TableCell>
                      <TableCell>765</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">4.6</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles key={i} className={`h-3 w-3 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          In Stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">$22,950</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AHA/BHA Exfoliating Peel</TableCell>
                      <TableCell>Treatments</TableCell>
                      <TableCell>652</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">4.4</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles key={i} className={`h-3 w-3 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Out of Stock
                        </span>
                      </TableCell>
                      <TableCell className="text-right">$32,600</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

