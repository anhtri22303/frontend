import axiosInstance from "@/lib/axiosInstance"

interface Order {
  orderId: string
  userId: string
  orderDate: string
  status: string
  total: number
  items: OrderItem[]
}

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

// Get orders by customer ID
export const fetchOrdersByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/orders`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    return null
  }
}

// Create a new order
export const createOrder = async (userId: string, orderData: Omit<Order, 'orderId'>) => {
  try {
    const response = await axiosInstance.post(`/user/${userId}/orders`, orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    return null
  }
}

// Get orders by order date
export const fetchOrdersByDate = async (userId: string, orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/orders/${orderDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    return null
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (userId: string, status: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}/orders/${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    return null
  }
}