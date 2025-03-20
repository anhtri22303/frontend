import axiosInstance from "@/lib/axiosInstance"

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  skinType: string
  loyalPoints: number
}

// Get all users
export const fetchAllUsersManager = async () => {
  try {
    const response = await axiosInstance.get("/manager/users")
    return response
  } catch (error) {
    console.error("Error fetching all users:", error)
    return null
  }
}

// Create a new user
export const createUser = async (userData: Omit<User, 'id' | 'loyalPoints'>) => {
  try {
    const response = await axiosInstance.post("/manager/users", userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

// Get user by ID
export const fetchUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Update user
export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/manager/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/manager/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    return null
  }
}

// Search users by name
export const searchUsers = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/search?name=${name}`)
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    return null
  }
}