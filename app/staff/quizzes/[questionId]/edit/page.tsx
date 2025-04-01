"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { fetchQuizById, updateQuiz } from "@/app/api/quizApi";

interface AnswerOption {
  optionId?: string;
  optionText: string;
  skinType: string;
}

interface QuizData {
  questionId: string;
  quizText: string;
  answerOptionDTOs: AnswerOption[];
}

export default function EditQuizPage() {
  const router = useRouter();
  const { questionId } = useParams();
  const [quizText, setQuizText] = useState("");
  const [options, setOptions] = useState<AnswerOption[]>([
    { optionText: "", skinType: "Dry" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questionId) {
      loadQuizData(questionId as string);
    } else {
      setError("Invalid quiz ID");
      setIsFetching(false);
    }
  }, [questionId]);

  const loadQuizData = async (id: string) => {
    setIsFetching(true);
    try {
      const quizData = await fetchQuizById(id);
      console.log("Fetch quiz data success:", quizData);

      if (!quizData || !quizData.quizText) {
        throw new Error("Invalid quiz data");
      }

      setQuizText(quizData.quizText);
      const newOptions =
        quizData.answerOptionDTOs && quizData.answerOptionDTOs.length > 0
          ? quizData.answerOptionDTOs
          : [{ optionText: "", skinType: "Dry" }];
      setOptions(newOptions);
      console.log("Updated options state:", newOptions); // Log để kiểm tra
    } catch (error) {
      console.error("Failed to load quiz:", error);
      setError("Failed to load quiz. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { optionText: "", skinType: "Dry" }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    index: number,
    field: keyof AnswerOption,
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!quizText.trim()) {
        alert("Please enter a question.");
        setIsLoading(false);
        return;
      }
      if (options.length === 0) {
        alert("Please add at least one answer option.");
        setIsLoading(false);
        return;
      }
      if (options.some((option) => !option.optionText.trim())) {
        alert("Please fill in all answer options.");
        setIsLoading(false);
        return;
      }

      const quizData = {
        quizText,
        answerOptionRequests: options.map(option => ({
          optionText: option.optionText,
          skinType: option.skinType,
        })),
      };

      await updateQuiz(questionId as string, quizData);
      router.push("/staff/quizzes");
    } catch (error) {
      console.error("Failed to update quiz:", error);
      setError("Failed to update quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="container mx-auto p-6">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">{error}</div>
        <Button
          className="mt-4"
          onClick={() => router.push("/staff/quizzes")}
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }
  console.log("Rendering options:", options);
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Question</label>
              <Input
                value={quizText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuizText(e.target.value)
                }
                placeholder="Enter quiz question"
              />
            </div>

            <div className="space-y-2">
              <label>Answers</label>
              {options.map((option, index) => (
                <div
                  key={option.optionId || `new-${index}`} // Sử dụng optionId nếu có, nếu không thì dùng index
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={option.optionText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOptionChange(index, "optionText", e.target.value)
                    }
                    placeholder={`Answer ${index + 1}`}
                    className="flex-1"
                  />
                  <Select
                    value={option.skinType}
                    onValueChange={(value) =>
                      handleOptionChange(index, "skinType", value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Oily">Oily</SelectItem>
                      <SelectItem value="Combination">Combination</SelectItem>
                      <SelectItem value="Sensitive">Sensitive</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddOption}
                className="mt-2"
              >
                + Add Answer
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push("/staff/quizzes")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Quiz"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}