import axiosInstance from "@/lib/axiosInstance"

export interface Promotion {
  promotionID: string
  promotionName: string
  productIDs: string[] // Changed from productID to productIDs to match API expectations
  discount: number
  startDate?: string
  endDate?: string
}

export const fetchPromotions = async () => {
  try {
    const response = await axiosInstance.get("/promotions")
    console.log("Get promotion success", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching promotions:", error)
    throw error
  }
}

export const createPromotion = async (promotion: Omit<Promotion, 'promotionID'>) => {
  try {
    // Make sure productIDs is an array, even if it's coming from older code as productID
    const requestData = {
      ...promotion,
      productIDs: Array.isArray(promotion.productIDs) ? promotion.productIDs : 
                 (promotion.productID ? Array.isArray(promotion.productID) ? promotion.productID : [promotion.productID] : [])
    };
    
    // Remove the old productID field if it exists to avoid confusion
    if ('productID' in requestData) {
      delete requestData.productID;
    }
    
    console.log("Sending promotion data:", requestData);
    const response = await axiosInstance.post("/promotions", requestData);
    console.log("Create promotion success", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
}

export const updatePromotion = async (id: string, promotion: Partial<Promotion>) => {
  try {
    const response = await axiosInstance.put(`/promotions/${id}`, promotion)
    console.log("Update promotion success" ,response.data)
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
    console.log("Get promotion by ID success" ,response.data)
    return response.data.data
  } catch (error) {
    console.error("Error fetching promotion:", error)
    throw error
  }
}

export const searchPromotionsByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/promotions/search`, {
      params: { name },
    })
    console.log("Search promotions success", response.data)
    return response.data
  } catch (error) {
    console.error("Error searching promotions:", error)
    throw error
  }
}
