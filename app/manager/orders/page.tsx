"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Order, fetchOrders, deleteOrder, fetchOrdersByCustomer, fetchOrdersByDate, fetchOrderByID, fetchOrdersByStatus } from "@/app/api/orderApi"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [customerIdSearch, setCustomerIdSearch] = useState("")
  const [orderDateSearch, setOrderDateSearch] = useState("")
  const [orderIdSearch, setOrderIdSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
    }
  }

  const handleSearch = async (type: string) => {
    try {
      let data
      switch (type) {
        case 'customer':
          data = await fetchOrdersByCustomer(customerIdSearch)
          break
        case 'date':
          data = await fetchOrdersByDate(orderDateSearch)
          break
        case 'order':
          data = await fetchOrderByID(orderIdSearch)
          break
        case 'status':
          data = await fetchOrdersByStatus(statusFilter)
          break
        default:
          await loadOrders()
          return
      }
      setOrders(Array.isArray(data) ? data : [data])
    } catch (error) {
      console.error("Error searching orders:", error)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId)
        loadOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
      }
    }
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/manager/orders/${orderId}`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by Customer ID"
            value={customerIdSearch}
            onChange={(e) => setCustomerIdSearch(e.target.value)}
          />
          <Button onClick={() => handleSearch('customer')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            type="date"
            value={orderDateSearch}
            onChange={(e) => setOrderDateSearch(e.target.value)}
          />
          <Button onClick={() => handleSearch('date')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by Order ID"
            value={orderIdSearch}
            onChange={(e) => setOrderIdSearch(e.target.value)}
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
            {orders.map((order) => (
              <tr key={order.orderID} className="border-b">
                <td className="p-4">{order.orderID}</td>
                <td className="p-4">{order.customerID || 'N/A'}</td>
                <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}