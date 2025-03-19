import axiosInstance from "@/lib/axiosInstance"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Beauty Advisor endpoints
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/beautyAdvisor/users")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const fetchAllUsersManager = async () => {
  try {
    const response = await axiosInstance.get("/manager/users")
    return response.data
  } catch (error) {
    console.error("Error fetching users (manager):", error)
    throw error
  }
}

// Áp dụng cùng một mẫu cho các API khác
export const createUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/manager/users", userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const fetchUserByEmail = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/${email}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw error
  }
}

export const searchUsersByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/search/${name}`)
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

// Manager endpoints
export const fetchUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw error
  }
}

export const updateUserManager = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/manager/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/manager/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export const searchUsersManager = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/search?name=${name}`)
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

// User self-update endpoint
export const updateUserSelf = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}