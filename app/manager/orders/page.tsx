"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Filter, RotateCw, Calendar, FileSearch, ChevronLeft, ChevronRight } from "lucide-react"
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    // Calculate total pages whenever orders array changes
    setTotalPages(Math.ceil(orders.length / itemsPerPage))
    // Reset to first page when data changes
    setCurrentPage(1)
  }, [orders])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await fetchOrders()
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
    router.push(`/manager/orders/${orderId}`)
  }

  const handleResetFilters = () => {
    setCustomerIdSearch("")
    setOrderDateSearch("")
    setOrderIdSearch("")
    setStatusFilter("")
    setFilteredOrder(null) // Reset filteredOrder
    loadOrders()
  }

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return orders.slice(startIndex, endIndex)
  }

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always add first page
      pages.push(1)
      
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // Always add last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Function to render payment badge based on payment method
  const renderPaymentBadge = (payment: string | undefined) => {
    if (!payment) return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">N/A</span>;
    
    switch(payment.toUpperCase()) {
      case 'COD':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">Cash on Delivery</span>;
      case 'CREDIT_CARD':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Credit Card</span>;
      case 'BANK_TRANSFER':
        return <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">Bank Transfer</span>;
      case 'PAYPAL':
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">PayPal</span>;
      case 'MOMO':
        return <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">MoMo</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{payment}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <RotateCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <RotateCw className="h-4 w-4" />
              Reset Filters
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Customer ID"
              value={customerIdSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerIdSearch(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={() => handleSearch('customer')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="date"
              value={orderDateSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderDateSearch(e.target.value)}
              className="pl-10 w-full"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={() => handleSearch('date')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Order ID"
              value={orderIdSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderIdSearch(e.target.value)}
              className="pl-10 w-full"
            />
            <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={() => handleSearch('order')}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
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
          </div>
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
              <th className="p-4 text-left font-medium">Payment</th>
              <th className="p-4 text-left font-medium">Total</th>
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
      <td className="p-4">
        {renderPaymentBadge(filteredOrder.payment)}
      </td>
      <td className="p-4">
        ${filteredOrder.discountedTotalAmount 
          ? filteredOrder.discountedTotalAmount.toFixed(2) 
          : filteredOrder.totalAmount 
          ? filteredOrder.totalAmount.toFixed(2) 
          : "0.00"}
      </td>
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
    getCurrentPageData().map((order) => (
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
        <td className="p-4">
          {renderPaymentBadge(order.payment)}
        </td>
        <td className="p-4">
          ${order.discountedTotalAmount 
            ? order.discountedTotalAmount.toFixed(2) 
            : order.totalAmount 
            ? order.totalAmount.toFixed(2) 
            : "0.00"}
        </td>
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
      <td colSpan={7} className="p-4 text-center text-muted-foreground">
        No orders found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      {!filteredOrder && !isLoading && orders.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2">
                {page}
              </span>
            )
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Pagination Info */}
      {!filteredOrder && !isLoading && orders.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {Math.min(orders.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(orders.length, currentPage * itemsPerPage)} of {orders.length} orders
        </div>
      )}
    </div>
  )
}