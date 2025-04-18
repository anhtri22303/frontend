"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Filter, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Order, fetchOrders, deleteOrder, fetchOrdersByCustomer, fetchOrdersByDate, fetchOrderByID, fetchOrdersByStatus } from "@/app/api/orderApi"
import toast from "react-hot-toast"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrder, setFilteredOrder] = useState<Order | null>(null) // State riêng cho orderID
  const [customerIdSearch, setCustomerIdSearch] = useState("")
  const [orderDateSearch, setOrderDateSearch] = useState("")
  const [orderIdSearch, setOrderIdSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await fetchOrders()
      console.log("Orders data:", data)
      setOrders(data || [])
      setFilteredOrder(null) // Reset filteredOrder khi load tất cả orders
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (type: string) => {
    setIsLoading(true)
    try {
      let response
      switch (type) {
        case 'customer':
          response = await fetchOrdersByCustomer(customerIdSearch)
          setOrders(response.data || [])
          setFilteredOrder(null) // Reset filteredOrder
          break
        case 'date':
          response = await fetchOrdersByDate(orderDateSearch)
          setOrders(response.data || [])
          setFilteredOrder(null) // Reset filteredOrder
          break
        case 'order':
          response = await fetchOrderByID(orderIdSearch)
          console.log("response", response)
          setFilteredOrder(response.data || null) // Set filteredOrder
          setOrders([]) // Clear orders list
          break
        case 'status':
          response = await fetchOrdersByStatus(statusFilter)
          setOrders(response.data || [])
          setFilteredOrder(null) // Reset filteredOrder
          break
        default:
          await loadOrders()
          return
      }
    } catch (error) {
      console.error("Error searching orders:", error)
      toast.error("Failed to filter orders")
      setOrders([])
      setFilteredOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId)
        toast.success("Order deleted successfully")
        loadOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
        toast.error("Failed to delete order")
      }
    }
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/staff/orders/${orderId}`)
  }

  const handleResetFilters = () => {
    setCustomerIdSearch("")
    setOrderDateSearch("")
    setOrderIdSearch("")
    setStatusFilter("")
    setFilteredOrder(null) // Reset filteredOrder
    loadOrders()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          disabled={isLoading}
        >
          {isLoading ? (
            <RotateCw className="h-4 w-4 animate-spin" />
          ) : (
            "Reset Filters"
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by Customer ID"
            value={customerIdSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerIdSearch(e.target.value)}
          />
          <Button onClick={() => handleSearch('customer')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            type="date"
            value={orderDateSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderDateSearch(e.target.value)}
          />
          <Button onClick={() => handleSearch('date')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by Order ID"
            value={orderIdSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderIdSearch(e.target.value)}
          />
          <Button onClick={() => handleSearch('order')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="PROCESSING">PROCESSING</SelectItem>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleSearch('status')}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">Order ID</th>
              <th className="p-4 text-left font-medium">Customer ID</th>
              <th className="p-4 text-left font-medium">Order Date</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-left font-medium">Total Amount</th>
              <th className="p-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrder ? (
              <tr className="border-b">
                <td className="p-4">{filteredOrder.orderID}</td>
                <td className="p-4">{filteredOrder.customerID || 'N/A'}</td>
                <td className="p-4">{filteredOrder.orderDate ? new Date(filteredOrder.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      filteredOrder.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : filteredOrder.status === 'PROCESSING'
                        ? 'bg-blue-100 text-blue-800'
                        : filteredOrder.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {filteredOrder.status}
                  </span>
                </td>
                <td className="p-4">${filteredOrder.totalAmount ? filteredOrder.totalAmount.toFixed(2) : '0.00'}</td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(filteredOrder.orderID)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteOrder(filteredOrder.orderID)}>
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderID} className="border-b">
                  <td className="p-4">{order.orderID}</td>
                  <td className="p-4">{order.customerID || 'N/A'}</td>
                  <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'PROCESSING'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order.orderID)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteOrder(order.orderID)}>
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}