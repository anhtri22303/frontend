import axiosInstance from "@/lib/axiosInstance";

interface Quiz {
  questionId: string;
  quizText: string;
}

interface AnswerOptionRequest {
  optionText: string;
  skinType: string;
}

interface CreateQuizData {
  quizText: string;
  answerOptionDTOS: AnswerOptionRequest[];
}

interface QuizResponse {
  questionId: string;
  quizText: string;
  answerOptionDTOs: {
    optionId: string;
    optionText: string;
    skinType: string;
  }[];
}

export const createQuiz = async (quizData: CreateQuizData): Promise<QuizResponse> => {
  try {
    const response = await axiosInstance.post("/quizzes", quizData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Các hàm khác giữ nguyên
export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get("/quizzes");
    console.log("Fetch quizzes data success", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

export const fetchQuizById = async (questionId: string): Promise<QuizResponse> => {
  try {
    const response = await axiosInstance.get(`/quizzes/${questionId}`);
    console.log("Get question success", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz with id ${questionId}:`, error);
    throw error;
  }
};

export const updateQuiz = async (questionId: string, quizData: CreateQuizData): Promise<QuizResponse> => {
  try {
    console.log("2",quizData);
    const response = await axiosInstance.put(`/quizzes/${questionId}`, quizData);
    console.log("3",response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating quiz with id ${questionId}:`, error);
    throw error;
  }
};

export const deleteQuiz = async (questionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/quizzes/${questionId}`);
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};