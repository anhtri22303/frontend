import axiosInstance from "@/lib/axiosInstance"

interface SkinCareRoutine {
  id: string
  name: string
  description: string
  category: string
  steps: string[]
  products: string[]
  skinType: string
  createdAt: string
  updatedAt: string
}

// Get all skincare routines
export const fetchRoutines = async () => {
  try {
    const response = await axiosInstance.get("/skin-care-routines")
    console.log("Get routines success")
    return response.data
  } catch (error) {
    console.error("Error fetching routines:", error)
    throw error
  }
}

// Create a new skincare routine
export const createRoutine = async (routine: Omit<SkinCareRoutine, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await axiosInstance.post("/skin-care-routines", routine)
    console.log("Create routine success")
    return response.data
  } catch (error) {
    console.error("Error creating routine:", error)
    throw error
  }
}

// Get skincare routine by ID
export const fetchRoutineById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/${id}`)
    console.log("Get routine success")
    return response.data
  } catch (error) {
    console.error("Error fetching routine:", error)
    throw error
  }
}

// Update skincare routine
export const updateRoutine = async (id: string, routine: Partial<SkinCareRoutine>) => {
  try {
    const response = await axiosInstance.put(`/skin-care-routines/${id}`, routine)
    console.log("Update routine success")
    return response.data
  } catch (error) {
    console.error("Error updating routine:", error)
    throw error
  }
}

// Delete skincare routine
export const deleteRoutine = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/skin-care-routines/${id}`)
    console.log("Delete routine success")
    return response.data
  } catch (error) {
    console.error("Error deleting routine:", error)
    throw error
  }
}

// Get routines by category
export const fetchRoutinesByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/category/${category}`)
    console.log("Get routines by category success")
    return response.data
  } catch (error) {
    console.error("Error fetching routines by category:", error)
    throw error
  }
}

// Search routines by name
export const searchRoutinesByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/skin-care-routines/search?name=${name}`)
    console.log("Search routines success")
    return response.data
  } catch (error) {
    console.error("Error searching routines:", error)
    throw error
  }
}