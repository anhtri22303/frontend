import axiosInstance from "@/lib/axiosInstance"

interface Promotion {
  promotionID: string
  promotionName: string
  discount: number
  startDate: string
  endDate: string
}

export const fetchPromotions = async () => {
  try {
    const response = await axiosInstance.get("/promotions")
    console.log("Get promotion success")
    return response.data
  } catch (error) {
    console.error("Error fetching promotions:", error)
    throw error
  }
}

export const createPromotion = async (promotion: Omit<Promotion, 'promotionID'>) => {
  try {
    const response = await axiosInstance.post("/promotions", promotion)
    console.log("Create promotion success")
    return response.data
  } catch (error) {
    console.error("Error creating promotion:", error)
    throw error
  }
}

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
// Get promotion by ID
export const fetchPromotionById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/promotions/${id}`)
    console.log("Get promotion by ID success")
    return response.data
  } catch (error) {
    console.error("Error fetching promotion:", error)
    throw error
  }
}
