import axiosInstance from "@/lib/axiosInstance"

export const fetchCart = async () => {
  try {
    const response = await axiosInstance.get("/cart")
    return response.data
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

export const addToCart = async (productId: string, quantity: number) => {
  try {
    const response = await axiosInstance.post("/cart", { productId, quantity })
    return response.data
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export const updateCart = async (productId: string, quantity: number) => {
  try {
    const response = await axiosInstance.put(`/cart/${productId}`, { quantity })
    return response.data
  } catch (error) {
    console.error("Error updating cart:", error)
    throw error
  }
}

export const deleteCartItem = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart/${productId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting cart item:", error)
    throw error
  }
}