import axiosInstance from "@/lib/axiosInstance"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  skinType: string
  loyalPoints: number
}

// Create a new customer
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'loyalPoints'>) => {
  try {
    const response = await axiosInstance.post('/user', customerData)
    return response.data
  } catch (error) {
    console.error("Error creating customer:", error)
    return null
  }
}

// Update customer by ID
export const updateCustomer = async (userId: string, customerData: Partial<Customer>) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, customerData)
    return response.data
  } catch (error) {
    console.error("Error updating customer:", error)
    return null
  }
}