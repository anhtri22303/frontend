import axiosInstance from "@/lib/axiosInstance"

interface Quiz {
  id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  difficulty: string
  createdAt: string
  updatedAt: string
}

// Get all quizzes
export const fetchQuizzes = async () => {
  try {
    const response = await axiosInstance.get("/quizzes")
    console.log("Get quizzes success")
    return response.data
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    throw error
  }
}

// Create a new quiz
export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await axiosInstance.post("/quizzes", quiz)
    console.log("Create quiz success")
    return response.data
  } catch (error) {
    console.error("Error creating quiz:", error)
    throw error
  }
}

// Get quiz by ID
export const fetchQuizById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/quizzes/${id}`)
    console.log("Get quiz success")
    return response.data
  } catch (error) {
    console.error("Error fetching quiz:", error)
    throw error
  }
}

// Update quiz
export const updateQuiz = async (id: string, quiz: Partial<Quiz>) => {
  try {
    const response = await axiosInstance.put(`/quizzes/${id}`, quiz)
    console.log("Update quiz success")
    return response.data
  } catch (error) {
    console.error("Error updating quiz:", error)
    throw error
  }
}

// Delete quiz
export const deleteQuiz = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/quizzes/${id}`)
    console.log("Delete quiz success")
    return response.data
  } catch (error) {
    console.error("Error deleting quiz:", error)
    throw error
  }
}