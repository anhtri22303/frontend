import axiosInstance from "@/lib/axiosInstance"

interface AnswerOption {
  id: string
  questionId: string
  content: string
  isCorrect: boolean
}

// Get all answer options
export const fetchAnswerOptions = async () => {
  try {
    const response = await axiosInstance.get("/answer-options")
    console.log("Get success")
    return response.data
  } catch (error) {
    console.error("Error fetching answer options:", error)
    throw error
  }
}

// Create a new answer option
export const createAnswerOption = async (answerOption: Omit<AnswerOption, 'id'>) => {
  try {
    const response = await axiosInstance.post("/answer-options", answerOption)
    console.log("Create success")
    return response.data
  } catch (error) {
    console.error("Error creating answer option:", error)
    throw error
  }
}

// Get an answer option by ID
export const fetchAnswerOptionById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/answer-options/${id}`)
    console.log("Get By ID success")
    return response.data
  } catch (error) {
    console.error("Error fetching answer option:", error)
    throw error
  }
}

// Update an answer option
export const updateAnswerOption = async (id: string, answerOption: Partial<AnswerOption>) => {
  try {
    const response = await axiosInstance.put(`/answer-options/${id}`, answerOption)
    console.log("Update success")
    return response.data
  } catch (error) {
    console.error("Error updating answer option:", error)
    throw error
  }
}

// Delete an answer option
export const deleteAnswerOption = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/answer-options/${id}`)
    console.log("Delete success")
    return response.data
  } catch (error) {
    console.error("Error deleting answer option:", error)
    throw error
  }
}