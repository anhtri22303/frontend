"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  X,
  Sparkles,
  Droplets,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function CustomerList() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // Sample customer data
  const customers = [
    {
      id: "1",
      name: "Sophia Anderson",
      email: "sophia@example.com",
      phone: "+1 (555) 123-4567",
      skinType: "Combination",
      joinDate: "May 15, 2023",
      status: "active",
      routineProgress: 85,
      totalSpent: "$1,245.00",
      lastPurchase: "2 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Acne", "Hyperpigmentation"],
      subscription: "Premium",
    },
    {
      id: "2",
      name: "Emma Rodriguez",
      email: "emma@example.com",
      phone: "+1 (555) 987-6543",
      skinType: "Dry",
      joinDate: "June 3, 2023",
      status: "active",
      routineProgress: 92,
      totalSpent: "$2,180.50",
      lastPurchase: "5 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Dryness", "Fine Lines"],
      subscription: "Premium",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1 (555) 456-7890",
      skinType: "Oily",
      joinDate: "April 22, 2023",
      status: "inactive",
      routineProgress: 45,
      totalSpent: "$560.25",
      lastPurchase: "3 weeks ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Oiliness", "Large Pores"],
      subscription: "Basic",
    },
    {
      id: "4",
      name: "Olivia Williams",
      email: "olivia@example.com",
      phone: "+1 (555) 789-0123",
      skinType: "Sensitive",
      joinDate: "July 10, 2023",
      status: "active",
      routineProgress: 78,
      totalSpent: "$890.75",
      lastPurchase: "1 week ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Redness", "Sensitivity"],
      subscription: "Premium",
    },
    {
      id: "5",
      name: "Daniel Brown",
      email: "daniel@example.com",
      phone: "+1 (555) 234-5678",
      skinType: "Normal",
      joinDate: "March 5, 2023",
      status: "active",
      routineProgress: 65,
      totalSpent: "$720.00",
      lastPurchase: "2 weeks ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Anti-aging", "Dullness"],
      subscription: "Basic",
    },
    {
      id: "6",
      name: "Ava Martinez",
      email: "ava@example.com",
      phone: "+1 (555) 345-6789",
      skinType: "Combination",
      joinDate: "August 18, 2023",
      status: "active",
      routineProgress: 90,
      totalSpent: "$1,675.50",
      lastPurchase: "3 days ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Uneven Texture", "Dark Circles"],
      subscription: "Premium",
    },
    {
      id: "7",
      name: "Noah Wilson",
      email: "noah@example.com",
      phone: "+1 (555) 876-5432",
      skinType: "Dry",
      joinDate: "February 12, 2023",
      status: "inactive",
      routineProgress: 30,
      totalSpent: "$320.25",
      lastPurchase: "1 month ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Flakiness", "Dehydration"],
      subscription: "Basic",
    },
    {
      id: "8",
      name: "Isabella Taylor",
      email: "isabella@example.com",
      phone: "+1 (555) 567-8901",
      skinType: "Oily",
      joinDate: "September 7, 2023",
      status: "active",
      routineProgress: 75,
      totalSpent: "$945.00",
      lastPurchase: "1 week ago",
      avatar: "/placeholder.svg?height=40&width=40",
      skinConcerns: ["Acne", "Blackheads"],
      subscription: "Premium",
    },
  ]

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const toggleAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map((customer) => customer.id))
    }
  }

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
                <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
                <p className="text-muted-foreground">View and manage your skincare customers</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button>Add Customer</Button>
              </div>
            </div>

            {/* Customer Filters */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search customers..." className="pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Subscription Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscriptions</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="none">No Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Skin Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skin Types</SelectItem>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="oily">Oily</SelectItem>
                      <SelectItem value="combination">Combination</SelectItem>
                      <SelectItem value="sensitive">Sensitive</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customer Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader className="p-4 md:p-6 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle>Customer List</CardTitle>
                      <CardDescription>{customers.length} customers total</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                                  onCheckedChange={toggleAllCustomers}
                                />
                                <span>Customer</span>
                              </div>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                              <div className="flex items-center gap-1">
                                <span>Skin Type</span>
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">
                              <div className="flex items-center gap-1">
                                <span>Subscription</span>
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium">
                              <div className="flex items-center gap-1">
                                <span>Status</span>
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">
                              <div className="flex items-center gap-1">
                                <span>Routine Progress</span>
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium">
                              <div className="flex items-center justify-end gap-1">
                                <span>Total Spent</span>
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </th>
                            <th className="h-12 px-4 text-center align-middle font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map((customer) => (
                            <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedCustomers.includes(customer.id)}
                                    onCheckedChange={() => toggleCustomerSelection(customer.id)}
                                  />
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={customer.avatar} alt={customer.name} />
                                    <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {customer.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <Badge variant="outline">{customer.skinType}</Badge>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <Badge variant={customer.subscription === "Premium" ? "default" : "secondary"}>
                                  {customer.subscription}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {customer.status === "active" ? (
                                    <>
                                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                      <span className="capitalize">Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                                      <span className="capitalize">Inactive</span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 hidden lg:table-cell">
                                <div className="flex items-center gap-2">
                                  <Progress value={customer.routineProgress} className="h-2 w-24" />
                                  <span className="text-sm">{customer.routineProgress}%</span>
                                </div>
                              </td>
                              <td className="p-4 text-right font-medium">{customer.totalSpent}</td>
                              <td className="p-4">
                                <div className="flex justify-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                      <DropdownMenuItem>View Orders</DropdownMenuItem>
                                      <DropdownMenuItem>View Routines</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">Delete Customer</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 md:p-6">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>1-8</strong> of <strong>24</strong> customers
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" disabled>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8">
                        3
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <Card>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Active Customers</CardTitle>
                    <CardDescription>Customers who are currently active in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Active customers content would go here */}
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">Active Customers</h3>
                      <p className="mt-2">You have 6 active customers with ongoing skincare routines.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inactive" className="mt-4">
                <Card>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Inactive Customers</CardTitle>
                    <CardDescription>Customers who haven't been active recently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Inactive customers content would go here */}
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">Inactive Customers</h3>
                      <p className="mt-2">You have 2 inactive customers who haven't logged in for over 30 days.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="new" className="mt-4">
                <Card>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>New Customers</CardTitle>
                    <CardDescription>Customers who joined in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* New customers content would go here */}
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Star className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">New Customers</h3>
                      <p className="mt-2">You have 3 new customers who joined in the last 30 days.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Customer Insights */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.5%</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                  <div className="mt-4">
                    <Progress value={87.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Routine Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">76.3%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                  <div className="mt-4">
                    <Progress value={76.3} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,250</div>
                  <p className="text-xs text-muted-foreground">+$120 from last month</p>
                  <div className="mt-4">
                    <Progress value={68} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

