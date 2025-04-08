import axiosInstance from "@/lib/axiosInstance"
export interface Feedback {
  feedbackID: string
  productID: string
  customerID: string
  rating: number
  comment: string
  feedbackDate: string
}

// Get all feedbacks
export const fetchFeedbacks = async () => {
  try {
    const response = await axiosInstance.get("/feedbacks")
    console.log("Get feedbacks success")
    return response.data.data
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    throw error
  }
}

// Create feedback
export const createFeedback = async (feedback: Omit<Feedback, "feedbackID">) => {
  try {
    const response = await axiosInstance.post("/feedbacks", feedback)
    console.log("Create feedback success")
    return response.data
  } catch (error) {
    console.error("Error creating feedback:", error)
    throw error
  }
}

// Get feedback by ID
export const fetchFeedbackById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/feedbacks/${id}`)
    console.log("Get feedback success")
    return response.data.data
  } catch (error) {
    console.error("Error fetching feedback:", error)
    throw error
  }
}

// Update feedback
export const updateFeedback = async (id: string, feedback: Partial<Feedback>) => {
  try {
    const response = await axiosInstance.put(`/feedbacks/${id}`, feedback)
    console.log("Update feedback success")
    return response.data
  } catch (error) {
    console.error("Error updating feedback:", error)
    throw error
  }
}

// Delete feedback
export const deleteFeedback = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/feedbacks/${id}`)
    console.log("Delete feedback success")
    return response.data
  } catch (error) {
    console.error("Error deleting feedback:", error)
    throw error
  }
}