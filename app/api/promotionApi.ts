import axiosInstance from "@/lib/axiosInstance"

interface Promotion {
  id: string
  name: string
  description: string
  discountPercent: number
  startDate: string
  endDate: string
  isActive: boolean
}

// Get all promotions
export const fetchPromotions = async () => {
  try {
    const response = await axiosInstance.get("/promotions")
    console.log("Get promotions success")
    return response.data
  } catch (error) {
    console.error("Error fetching promotions:", error)
    throw error
  }
}

// Create a new promotion
export const createPromotion = async (promotion: Omit<Promotion, 'id'>) => {
  try {
    const response = await axiosInstance.post("/promotions", promotion)
    console.log("Create promotion success")
    return response.data
  } catch (error) {
    console.error("Error creating promotion:", error)
    throw error
  }
}

// Get promotion by ID
export const fetchPromotionById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/promotions/${id}`)
    console.log("Get promotion success")
    return response.data
  } catch (error) {
    console.error("Error fetching promotion:", error)
    throw error
  }
}

// Update promotion
export const updatePromotion = async (id: string, promotion: Partial<Promotion>) => {
  try {
    const response = await axiosInstance.put(`/promotions/${id}`, promotion)
    console.log("Update promotion success")
    return response.data
  } catch (error) {
    console.error("Error updating promotion:", error)
    throw error
  }
}

// Delete promotion
export const deletePromotion = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/promotions/${id}`)
    console.log("Delete promotion success")
    return response.data
  } catch (error) {
    console.error("Error deleting promotion:", error)
    throw error
  }
}