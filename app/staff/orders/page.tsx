"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { fetchOrders, deleteOrder, fetchOrdersByCustomer, fetchOrdersByDate, fetchOrderByID, fetchOrdersByStatus } from "@/app/api/orderApi"

interface Order {
  orderID: string
  customerID: string
  orderDate: string
  status: string
  payment: string
  totalAmount: number
}

export default function OrdersPage() {
  const router = useRouter()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
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

  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const handleSearch = async (type: string) => {
    try {
      let response
      switch (type) {
        case 'customer':
          response = await fetchOrdersByCustomer(customerIdSearch)
          break
        case 'date':
          response = await fetchOrdersByDate(orderDateSearch)
          break
        case 'order':
          response = await fetchOrderByID(orderIdSearch)
          break
        case 'status':
          response = await fetchOrdersByStatus(statusFilter)
          break
      }
      setOrders(response.data)
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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative">
          <Input
            placeholder="Search by Customer ID"
            value={customerIdSearch}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setCustomerIdSearch(e.target.value)}
            onKeyDown={(e: { key: string }) => e.key === "Enter" && handleSearch('customer')}
          />
        </div>
        <div className="relative">
          <Input
            type="date"
            value={orderDateSearch}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setOrderDateSearch(e.target.value)}
            onKeyDown={(e: { key: string }) => e.key === "Enter" && handleSearch('date')}
          />
        </div>
        <div className="relative">
          <Input
            placeholder="Search by Order ID"
            value={orderIdSearch}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setOrderIdSearch(e.target.value)}
            onKeyDown={(e: { key: string }) => e.key === "Enter" && handleSearch('order')}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value)
          handleSearch('status')
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => router.push('/staff/orders/create')} className="mb-4">
        Create New Order
      </Button>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={() => {
                      if (selectedOrders.length === orders.length) {
                        setSelectedOrders([])
                      } else {
                        setSelectedOrders(orders.map((order) => order.orderID))
                      }
                    }}
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Payment</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderID} className="border-b">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedOrders.includes(order.orderID)}
                      onChange={() => toggleOrderSelection(order.orderID)}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">#{order.orderID}</td>
                  <td className="px-4 py-3 text-sm">{order.customerID}</td>
                  <td className="px-4 py-3 text-sm">{order.orderDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.payment}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/staff/orders/${order.orderID}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/staff/orders/edit/${order.orderID}`)}>
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOrder(order.orderID)}>
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-3 text-center text-sm text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of{" "}
            <span className="font-medium">{orders.length}</span> orders
          </div>
        </div>
      </div>
    </>
  )
}

