import axiosInstance from "@/lib/axiosInstance"

interface CartItem {
  productID: string
  quantity: number
  price?: number
}

interface Cart {
  userID: string
  items: CartItem[]
  total: number
}

// Get cart by user ID
export const fetchCartByUserId = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/cart/${userID}`)
    console.log("Get cart success")
    return response.data
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

// Get specific cart item
export const fetchCartItem = async (userId: string, productID: string) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}/${productID}`)
    console.log("Get cart item success")
    return response.data
  } catch (error) {
    console.error("Error fetching cart item:", error)
    throw error
  }
}

// Update cart item quantity
export const updateCartItem = async (userId: string, productID: string, quantity: number) => {
  try {
    const response = await axiosInstance.put(`/cart/${userId}/${productID}`, { quantity })
    console.log("Update cart item success")
    return response.data
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

export const addToCart = async (userId: string, productID: String) => {
  try {
    const response = await axiosInstance.post(
      `/cart/${userId}/add/${productID}`
    );
    console.log("Add to cart success");
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to add to cart: Server error");
    } else if (error.request) {
      throw new Error("Failed to add to cart: No response from server");
    } else {
      throw new Error("Failed to add to cart: " + error.message);
    }
  }
};

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
export const removeFromCart = async (userId: string, productID: string) => {
  try {
    const response = await axiosInstance.delete(`/cart/${userId}/remove/${productID}`)
    console.log("Remove from cart success")
    return response.data
  } catch (error) {
    console.error("Error removing item from cart:", error)
    throw error
  }
}