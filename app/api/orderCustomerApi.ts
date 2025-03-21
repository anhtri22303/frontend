import axiosInstance from "@/lib/axiosInstance"

interface Order {
  orderID: string
  userID: string
  orderDate: string
  status: string
  total: number
  items: OrderItem[]
}

interface OrderItem {
  productID: string
  quantity: number
  price: number
}

// Get orders by customer ID
export const fetchOrdersByUserID = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userID}/orders`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    return null
  }
}

// Create new order Customer
export const createOrder = async (userID: String ,orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post(`/orders/${userID}`, orderData)
    console.log("Create order Customer success")
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get orders by order date
export const fetchOrdersByDate = async (userID: string, orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userID}/orders/${orderDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    return null
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (userID: string, status: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userID}/orders/${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    return null
  }
}