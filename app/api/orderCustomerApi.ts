import axiosInstance from "@/lib/axiosInstance"

export interface OrderDetail {
  orderID: string | null
  productID: string
  productName?: string
  quantity: number
  productPrice?: number
  discountName?: string
  discountPercentage?: number
  totalAmount: number
  discountedTotalAmount?: number
}

export interface Order {
  orderID: string
  customerID: string
  customerName?: string
  orderDate: string
  status: string
  totalAmount: number
  discountedTotalAmount?: number
  payment?: string
  promotion?: string
  orderDetails?: OrderDetail[]
}

// Get orders by customer ID
export const fetchOrdersByUserID = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}`)
    console.log("Get customer orders success", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    return null
  }
}

// Create new order Customer
export const createCustomerOrder = async (userID: string, orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post(`/orders/customer/${userID}/create`, {
      customerID: orderData.customerID,
      orderDate: orderData.orderDate,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      payment: orderData.payment,
      orderDetails: orderData.orderDetails?.map(item => ({
        productID: item.productID,
        quantity: item.quantity,
        productPrice: item.productPrice,
        totalAmount: item.totalAmount
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

// Get order details by user ID and order ID
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

// Get order by ID for a specific user
export const fetchOrderByIdForUser = async (userID: string, orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/customer/${userID}/${orderID}`)
    console.log("Order Success: ", response.data.data)
    return response.data.data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}