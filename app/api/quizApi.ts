import axiosInstance from "@/lib/axiosInstance";

interface Quiz {
  questionId: string;
  quizText: string;
}

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get("/api/quizzes");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

export const deleteQuiz = async (questionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/quizzes/${questionId}`);
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};