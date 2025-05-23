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
  customerID: string | null
  customerName?: string
  orderDate: string
  status: string
  totalAmount: number
  discountedTotalAmount?: number
  payment?: string
  promotion?: string
  orderDetails?: OrderDetail[]
}


// Get all orders
export const fetchOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/staff")
    console.log("Get all orders success", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

// Create new order
export const createOrder = async (orderData: Omit<Order, 'orderID'>) => {
  try {
    const response = await axiosInstance.post("/orders/staff", orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Get orders by customer ID
export const fetchOrdersByCustomer = async (customerID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/staff/customer/${customerID}`)
    return response.data
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    throw error
  }
}

// Get orders by date
export const fetchOrdersByDate = async (orderDate: string) => {
  try {
    const response = await axiosInstance.get(`/orders/staff/date/${orderDate}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by date:", error)
    throw error
  }
}

// Get order by ID
export const fetchOrderByID = async (orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/staff/${orderID}`)
    console.log("Order Success: ", response.data.data);
    return response.data.data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

// Update order
export const updateOrder = async (orderID: string, status: string) => {
  console.log("Status", status);
  try {
    const response = await axiosInstance.put(`/orders/staff/${orderID}`, { status }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    const response = await axiosInstance.delete(`/orders/staff/${orderID}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order:", error)
    throw error
  }
}

// Get order details
export const fetchOrderDetails = async (orderID: string) => {
  try {
    const response = await axiosInstance.get(`/orders/staff/${orderID}/details`)
    return response.data
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// Create order detail
export const createOrderDetail = async (orderID: string, detailData: OrderDetail) => {
  try {
    const response = await axiosInstance.post(`/orders/staff/${orderID}/details`, detailData)
    return response.data
  } catch (error) {
    console.error("Error creating order detail:", error)
    throw error
  }
}

// Update order detail
export const updateOrderDetail = async (orderID: string, productID: string, detailData: Partial<OrderDetail>) => {
  try {
    const response = await axiosInstance.put(`/orders/staff/${orderID}/details/${productID}`, detailData)
    return response.data
  } catch (error) {
    console.error("Error updating order detail:", error)
    throw error
  }
}

// Delete order detail
export const deleteOrderDetail = async (orderID: string, productID: string) => {
  try {
    const response = await axiosInstance.delete(`/orders/staff/${orderID}/details/${productID}`)
    return response.data
  } catch (error) {
    console.error("Error deleting order detail:", error)
    throw error
  }
}

// Get orders by status
export const fetchOrdersByStatus = async (status: string) => {
  try {
    const response = await axiosInstance.get(`/orders/staff/status/${status}`)
    return response.data
  } catch (error) {
    console.error("Error fetching orders by status:", error)
    throw error
  }
}