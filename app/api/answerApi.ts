import axiosInstance from "@/lib/axiosInstance";

interface AnswerOption {
  optionId: string;
  questionId: string;
  optionText: string;
  skinType: string;
}

export const fetchAnswerOptions = async (): Promise<AnswerOption[]> => {
  try {
    const response = await axiosInstance.get("/api/answer-options");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching answer options:", error);
    throw error;
  }
};

export const deleteAnswerOption = async (optionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/answer-options/${optionId}`);
  } catch (error) {
    console.error("Error deleting answer option:", error);
    throw error;
  }
};