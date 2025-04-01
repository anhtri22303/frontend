import axiosInstance from "@/lib/axiosInstance"

interface User {
  userID: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  skinType: string
  loyalPoints: number
}

// Get all users with role MANAGER and STAFF
export const fetchStaffAndManagers = async () => {
  try {
    const response = await axiosInstance.get("/manager/users?role=STAFF,MANAGER")
    return response
  } catch (error) {
    console.error("Error fetching staff and managers:", error)
    return null
  }
}

// Get all customers (users with role CUSTOMER)
export const fetchCustomers = async () => {
  try {
    const response = await axiosInstance.get("/manager/users?role=CUSTOMER")
    return response
  } catch (error) {
    console.error("Error fetching customers:", error)
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
export const fetchUserById = async (userID: string) => {
  try {
    const response = await axiosInstance.get(`/user/${userID}`)
    console.log("GET user by ID success", response.data)
    return response.data.data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Update user
export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, userData)
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

// Search users by name and role
export const searchUsersByRole = async (name: string, role: string) => {
  try {
    const response = await axiosInstance.get(`/manager/users/search?name=${name}&role=${role}`)
    return response.data
  } catch (error) {
    console.error("Error searching users:", error)
    return null
  }
}