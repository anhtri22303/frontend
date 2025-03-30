"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

const questions: QuizQuestion[] = [
  // 3 câu hỏi về Skin Type
  {
    id: 1,
    question: "What is your skin type?",
    options: ["Dry", "Oily", "Combination", "Sensitive", "Normal"],
  },
  {
    id: 2,
    question: "How does your skin feel after cleansing?",
    options: ["Dry", "Oily", "Combination", "Sensitive", "Normal"],
  },
  {
    id: 3,
    question: "How does your skin react to the sun?",
    options: ["Dry", "Oily", "Combination", "Sensitive", "Normal"],
  },
  // 3 câu hỏi về Category
  {
    id: 4,
    question: "Which product do you use most often?",
    options: ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"],
  },
  {
    id: 5,
    question: "Which product do you prioritize in your routine?",
    options: ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"],
  },
  {
    id: 6,
    question: "Which product do you want to improve?",
    options: ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"],
  },
];

export default function SkinQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      router.push("/login?redirect=/skin-quiz");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, calculate results
      const skinTypeAnswers = Object.values(answers).slice(0, 3); // Lấy 3 câu đầu
      const categoryAnswers = Object.values(answers).slice(3, 6); // Lấy 3 câu sau

      // Tính toán Skin Type
      const skinTypeCounts: { [key: string]: number } = {};
      skinTypeAnswers.forEach((answer) => {
        skinTypeCounts[answer] = (skinTypeCounts[answer] || 0) + 1;
      });
      const selectedSkinTypes = Object.keys(skinTypeCounts).filter(
        (key) =>
          skinTypeCounts[key] === Math.max(...Object.values(skinTypeCounts))
      );

      // Tính toán Category
      const categoryCounts: { [key: string]: number } = {};
      categoryAnswers.forEach((answer) => {
        categoryCounts[answer] = (categoryCounts[answer] || 0) + 1;
      });
      const selectedCategories = Object.keys(categoryCounts).filter(
        (key) =>
          categoryCounts[key] === Math.max(...Object.values(categoryCounts))
      );

      // Chuyển đến trang kết quả với các lựa chọn
      const queryParams = new URLSearchParams({
        skinTypes: selectedSkinTypes.join(","),
        categories: selectedCategories.join(","),
      });
      router.push(`/skin-quiz/results?${queryParams.toString()}`);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Skin Care Quiz</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestionData.question}
            </h2>
            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[currentQuestion] || ""}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="w-full"
          >
            {currentQuestion === questions.length - 1
              ? "See Results"
              : "Next Question"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm text-gray-500">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
}
