import axiosInstance from "@/lib/axiosInstance"

export interface OrderDetail {
  productID: string
  quantity: number
  price: number
}

export interface Order {
  orderID: string
  customerID: string
  orderDate: string
  status: string
  totalAmount: number
  details?: OrderDetail[]
}

// Get all orders
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders")
    console.log("Get success")
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

// Create new order
export const createOrder = async (userID: String ,orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post(`/orders/${userID}`, orderData)
    console.log("Create order success")
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get orders by customer ID
export const fetchOrdersByCustomer = async (customerID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/${customerID}`)
    console.log("Get By Customer success")
    return response.data
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    throw error
  }
}

// Get orders by date
export const fetchOrdersByDate = async (orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderDate}`)
    console.log("Get By Date success")
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    throw error
  }
}

// Get order by ID
export const fetchOrderByID = async (orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderID}`)
    console.log("Get By ID success")
    return response.data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

// Update order
export const updateOrder = async (orderID: string, orderData: Partial<Order>) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderID}`, orderData)
    console.log("Update success")
    return response.data
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

// Delete order
export const deleteOrder = async (orderID: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderID}`)
    console.log("Delete success")
    return response.data
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

// Get order details
export const fetchOrderDetails = async (orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/manager/${orderID}/details`)
    console.log("Get Order Detail success")
    return response.data
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// Create order detail
export const createOrderDetail = async (orderID: string, detailData: OrderDetail) => {
  try {
    const response = await axiosInstance.post(`/orders/${orderID}/details`, detailData)
    console.log("Create Order Detail success")
    return response.data
  } catch (error) {
    console.error("Error creating order detail:", error)
    throw error
  }
}

// Update order detail
export const updateOrderDetail = async (orderID: string, productID: string, detailData: Partial<OrderDetail>) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderID}/details/${productID}`, detailData)
    console.log("Update Order Detail success")
    return response.data
  } catch (error) {
    console.error("Error updating order detail:", error)
    throw error
  }
}

// Delete order detail
export const deleteOrderDetail = async (orderID: string, productID: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderID}/details/${productID}`)
    console.log("Delete Order Detail success")
    return response.data
  } catch (error) {
    console.error("Error deleting order detail:", error)
    throw error
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (status: string) => {
  try {
    const response = await axiosInstance.get(`/orders/${status}`)
    console.log("Get By Status success")
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    throw error
  }
}