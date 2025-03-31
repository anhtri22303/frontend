"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/app/api/quizApi";
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

interface AnswerOption {
  optionText: string;
  skinType: string;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [quizText, setQuizText] = useState("");
  const [options, setOptions] = useState<AnswerOption[]>([
    { optionText: "", skinType: "DRY" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, { optionText: "", skinType: "DRY" }]);
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
    try {
      // Validation
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
        answerOptions: options.map(option => ({
          optionText: option.optionText,
          skinType: option.skinType
        }))
      };
      
      await createQuiz(quizData);
      router.push("/staff/quizzes");
    } catch (error) {
      console.error("Failed to create quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
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
                <div key={index} className="flex items-center space-x-2">
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
                      <SelectItem value="DRY">Dry</SelectItem>
                      <SelectItem value="OILY">Oily</SelectItem>
                      <SelectItem value="COMBINATION">Combination</SelectItem>
                      <SelectItem value="SENSITIVE">Sensitive</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Quiz"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}