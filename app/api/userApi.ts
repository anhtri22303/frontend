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
    console.log("Get all users success")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const fetchUserByEmail = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/${email}`)
    console.log("Get user by email success")
    return response.data
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw error
  }
}

export const searchUsersByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/beautyAdvisor/users/search/${name}`)
    console.log("Search users by name success")
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

// Manager endpoints
export const fetchAllUsersManager = async () => {
  try {
    const response = await axiosInstance.get("/manager/users")
    console.log("Get all users (manager) success")
    return response.data
  } catch (error) {
    console.error("Error fetching users (manager):", error)
    throw error
  }
}

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await axiosInstance.post("/manager/users", user)
    console.log("Create user success")
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const fetchUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/${userId}`)
    console.log("Get user by ID success")
    return response.data
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw error
  }
}

export const updateUserManager = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/manager/users/${userId}`, userData)
    console.log("Update user success")
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/manager/users/${userId}`)
    console.log("Delete user success")
    return response.data
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export const searchUsersManager = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/search?name=${name}`)
    console.log("Search users success")
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
    console.log("Update user profile success")
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}