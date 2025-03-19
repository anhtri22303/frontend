import axiosInstance from "@/lib/axiosInstance"

interface CartItem {
  productId: string
  quantity: number
  price: number
}

interface Cart {
  userId: string
  items: CartItem[]
  total: number
}

// Get cart by user ID
export const fetchCartByUserId = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}`)
    console.log("Get cart success")
    return response.data
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

// Get specific cart item
export const fetchCartItem = async (userId: string, productId: string) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}/${productId}`)
    console.log("Get cart item success")
    return response.data
  } catch (error) {
    console.error("Error fetching cart item:", error)
    throw error
  }
}

// Update cart item quantity
export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  try {
    const response = await axiosInstance.put(`/cart/${userId}/${productId}`, { quantity })
    console.log("Update cart item success")
    return response.data
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

// Add item to cart
export const addToCart = async (userId: string, item: CartItem) => {
  try {
    const response = await axiosInstance.post(`/cart/${userId}/add`, item)
    console.log("Add to cart success")
    return response.data
  } catch (error) {
    console.error("Error adding item to cart:", error)
    throw error
  }
}

// Clear cart
export const clearCart = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart/${userId}/clear`)
    console.log("Clear cart success")
    return response.data
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (userId: string, productId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart/${userId}/remove/${productId}`)
    console.log("Remove from cart success")
    return response.data
  } catch (error) {
    console.error("Error removing item from cart:", error)
    throw error
  }
}