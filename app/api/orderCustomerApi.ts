import axiosInstance from "@/lib/axiosInstance"

interface OrderItem {
  productID: string
  quantity: number
  price: number
}

interface Order {
  customerID: string
  orderDate: string
  status: string
  totalAmount: number
  orderDetails: OrderItem[]
}

// Get orders by customer ID
export const fetchOrdersByUserID = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    return null
  }
}

// Create new order Customer
export const createCustomerOrder = async (userID: string, orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post(`/orders/customer/${userID}`, {
      customerID: orderData.customerID,
      orderDate: orderData.orderDate,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      orderDetails: orderData.orderDetails.map(item => ({
        productID: item.productID,
        quantity: item.quantity,
        price: item.price
      }))
    })
    console.log("Create order Customer success", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get orders by order date
export const fetchOrdersByDate = async (userID: string, orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}/date/${orderDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    return null
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (userID: string, status: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}/status/${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    return null
  }
}

export const fetchOrderDetailsByUserID = async (userID: string, orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}/${orderID}/details`)
    console.log("Fetch order details by user ID success:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching order details by user ID:", error)
    return null
  }
}