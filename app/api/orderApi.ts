import axiosInstance from "@/lib/axiosInstance"

export interface OrderDetail {
  orderID: string | null
  productID: string
  quantity: number
  price: number
}

export interface Order {
  orderID: string
  customerID: string | null
  orderDate: string
  status: string
  totalAmount: number
  orderDetails?: OrderDetail[]
}

// Get all orders
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/manager")
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

// Create new order
export const createOrder = async (orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post("/orders/manager", orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get orders by customer ID
export const fetchOrdersByCustomer = async (customerID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/manager/customer/${customerID}`)
    return response.data
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    throw error
  }
}

// Get orders by date
export const fetchOrdersByDate = async (orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/orders/manager/${orderDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    throw error
  }
}

// Get order by ID
export const fetchOrderByID = async (orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/manager/${orderID}`)
    return response.data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

// Update order
export const updateOrder = async (orderID: string, orderData: Partial<Order>) => {
  try {
    const response = await axiosInstance.put(`/orders/manager/${orderID}`, orderData);
    console.log("Order updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderID: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/manager/${orderID}`)
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
    return response.data
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// Create order detail
export const createOrderDetail = async (orderID: string, detailData: OrderDetail) => {
  try {
    const response = await axiosInstance.post(`/orders/manager/${orderID}/details`, detailData)
    return response.data
  } catch (error) {
    console.error("Error creating order detail:", error)
    throw error
  }
}

// Update order detail
export const updateOrderDetail = async (orderID: string, productID: string, detailData: Partial<OrderDetail>) => {
  try {
    const response = await axiosInstance.put(`/orders/manager/${orderID}/details/${productID}`, detailData)
    return response.data
  } catch (error) {
    console.error("Error updating order detail:", error)
    throw error
  }
}

// Delete order detail
export const deleteOrderDetail = async (orderID: string, productID: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/manager/${orderID}/details/${productID}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order detail:", error)
    throw error
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (status: string) => {
  try {
    const response = await axiosInstance.get(`/orders/manager/status/${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    throw error
  }
}