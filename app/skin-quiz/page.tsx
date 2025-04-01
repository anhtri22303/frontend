"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetchQuizzes } from "@/app/api/quizApi";

interface Quiz {
  questionId: string;
  quizText: string;
  answerOptionDTOS?: {
    optionID: string;
    optionText: string;
    questionID: string;
    skinType: string;
  }[];
}

export default function SkinQuiz() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [skinTypeCounts, setSkinTypeCounts] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchQuizzes();
        console.log("Fetched quizzes response:", response);
        setQuizzes(response || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizData();
  }, [router]);

  const handleNextQuestion = () => {
    if (!currentSelection) return;
  
    const selectedOption = currentQuiz.answerOptionDTOS?.find(
      (option) => option.optionText === currentSelection
    );
  
    if (selectedOption) {
      // Save the answer
      setSelectedAnswers((prev) => [...prev, selectedOption.optionText]);
      setSkinTypeCounts((prev) => ({
        ...prev,
        [selectedOption.skinType]: (prev[selectedOption.skinType] || 0) + 1,
      }));
  
      // Move to next question or show results
      if (currentQuestionIndex < quizzes.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentSelection(null); // Reset selection for next question
      } else {
        // Calculate final skin type and navigate to results
        const finalSkinType = Object.keys(skinTypeCounts).reduce((a, b) =>
          skinTypeCounts[a] > skinTypeCounts[b] ? a : b
        );
        router.push(`/skin-quiz/results?skinType=${finalSkinType}`);
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (quizzes.length === 0 || !quizzes[currentQuestionIndex]) {
    return <div className="container mx-auto px-4 py-8">No quizzes available.</div>;
  }

  const currentQuiz = quizzes[currentQuestionIndex];
  console.log("Current Quiz:", currentQuiz);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Skin Care Quiz</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{currentQuiz.quizText}</h2>
            <RadioGroup
              value={currentSelection || ""}
              onValueChange={(value) => {
                setCurrentSelection(value);
              }}
              className="space-y-3"
            >
              {currentQuiz?.answerOptionDTOS?.length ? (
                currentQuiz.answerOptionDTOS.map((option) => (
                  <div key={option.optionID} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.optionText} id={option.optionID} />
                    <Label htmlFor={option.optionID}>{option.optionText}</Label>
                  </div>
                ))
              ) : (
                <div>No options available</div>
              )}
            </RadioGroup>
          </div>
          <Button
            onClick={handleNextQuestion}
            disabled={!currentSelection}
            className="w-full"
          >
            {currentQuestionIndex === quizzes.length - 1 ? "See Results" : "Next Question"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm text-gray-500">
        Question {currentQuestionIndex + 1} of {quizzes.length}
      </div>
    </div>
  );
}
