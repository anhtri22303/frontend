"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchQuizzes, deleteQuiz } from "@/app/api/quizApi";
import { fetchAnswerOptions, deleteAnswerOption } from "@/app/api/answerApi";

interface Quiz {
  questionId: string;
  quizText: string;
}

interface AnswerOption {
  optionId: string;
  questionId: string;
  optionText: string;
  skinType: string;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]); // Lưu trữ tất cả quizzes gốc
  const [answerOptions, setAnswerOptions] = useState<Record<string, AnswerOption[]>>({});
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const quizzesData = await fetchQuizzes();
      console.log("Fetch quizzes data success", quizzesData);
      setQuizzes(quizzesData);
      setAllQuizzes(quizzesData); // Lưu trữ bản sao gốc

      // Sau khi lấy danh sách quizzes, gọi loadAnswerOptionsForQuiz cho từng quiz
      for (const quiz of quizzesData) {
        await loadAnswerOptionsForQuiz(quiz.questionId);
      }
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnswerOptionsForQuiz = async (questionId: string) => {
    try {
      const answerOptionsData = await fetchAnswerOptions(questionId);
      console.log("Fetch answer data success for questionId", questionId, answerOptionsData);
      setAnswerOptions(prev => ({
        ...prev,
        [questionId]: answerOptionsData
      }));
    } catch (error) {
      console.error(`Error loading answer options for questionId ${questionId}:`, error);
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setQuizzes(allQuizzes);
      return;
    }
    const filteredQuizzes = allQuizzes.filter((quiz) =>
      quiz.quizText.toLowerCase().includes(searchText.toLowerCase())
    );
    setQuizzes(filteredQuizzes);
  };

  const handleDeleteQuiz = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this quiz and its answer options?")) {
      try {
        await deleteQuiz(questionId);
        setQuizzes(quizzes.filter(q => q.questionId !== questionId));
        setAllQuizzes(allQuizzes.filter(q => q.questionId !== questionId));
        setAnswerOptions(prev => {
          const newOptions = { ...prev };
          delete newOptions[questionId];
          return newOptions;
        });
        if (selectedQuizId === questionId) setSelectedQuizId(null);
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const handleDeleteAnswerOption = async (optionId: string, questionId: string) => {
    if (confirm("Are you sure you want to delete this answer option?")) {
      try {
        await deleteAnswerOption(optionId);
        setAnswerOptions(prev => ({
          ...prev,
          [questionId]: prev[questionId].filter(opt => opt.optionId !== optionId)
        }));
      } catch (error) {
        console.error("Error deleting answer option:", error);
      }
    }
  };

  const toggleQuizDetails = async (questionId: string) => {
    // Nếu answer options chưa được tải, gọi API để lấy
    if (!answerOptions[questionId]) {
      await loadAnswerOptionsForQuiz(questionId);
    }
    setSelectedQuizId(selectedQuizId === questionId ? null : questionId);
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Quizzes</h1>
        <Button onClick={() => router.push("/staff/quizzes/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Quiz
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search quizzes by question..."
          className="pl-8 w-full max-w-md"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center">Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Quizzes Found</h3>
              <p className="text-sm text-gray-500">
                {searchText
                  ? "Try adjusting your search to find what you're looking for."
                  : "There are no quizzes available at the moment."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Question</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.questionId} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <button
                          className="text-left font-medium text-blue-600 hover:underline"
                          onClick={() => toggleQuizDetails(quiz.questionId)}
                        >
                          {quiz.quizText}
                        </button>
                        {selectedQuizId === quiz.questionId && (
                          <div className="mt-2 pl-4">
                            <h4 className="text-sm font-semibold mb-2">Answer Options</h4>
                            {answerOptions[quiz.questionId]?.length > 0 ? (
                              <ul className="space-y-2">
                                {answerOptions[quiz.questionId].map((option) => (
                                  <li
                                    key={option.optionId}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                  >
                                    <div>
                                      <p className="text-sm">{option.optionText}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Skin Type: {option.skinType}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          router.push(
                                            `/staff/quizzes/${quiz.questionId}/answer-options/${option.optionId}/edit`
                                          )
                                        }
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600"
                                        onClick={() => handleDeleteAnswerOption(option.optionId, quiz.questionId)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No answer options available.
                              </p>
                            )}
                            <Button
                              variant="link"
                              className="mt-2 p-0 text-sm text-blue-600"
                              onClick={() =>
                                router.push(`/staff/quizzes/${quiz.questionId}/answer-options/create`)
                              }
                            >
                              + Add Answer Option
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/staff/quizzes/${quiz.questionId}/edit`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteQuiz(quiz.questionId)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {quizzes.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{quizzes.length}</span> of{" "}
              <span className="font-medium">{allQuizzes.length}</span> quizzes
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}