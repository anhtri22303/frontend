import axiosInstance from "@/lib/axiosInstance"

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
}

// Get all users
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/beautyAdvisor/users")
    return response.data
  } catch (error) {
    console.error("Error fetching all users:", error)
    return null
  }
}

// Get user by email
export const fetchUserByEmail = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/${email}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

// Search user by name
export const searchUserByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/search/${name}`)
    return response.data
  } catch (error) {
    console.error("Error searching user by name:", error)
    return null
  }
}