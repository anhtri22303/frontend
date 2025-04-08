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
  
  // Thêm các state mới cho câu hỏi quyết định
  const [showTiebreakerQuestion, setShowTiebreakerQuestion] = useState(false);
  const [tiedSkinTypes, setTiedSkinTypes] = useState<string[]>([]);
  const [tiebreakerQuiz, setTiebreakerQuiz] = useState<Quiz | null>(null);
  const [tiebreakerOptions, setTiebreakerOptions] = useState<any[]>([]);

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
  
  // Hàm để chọn ngẫu nhiên câu hỏi quyết định và lọc các đáp án
  const selectRandomTiebreakerQuestion = (tiedTypes: string[]) => {
    // Chọn một câu hỏi ngẫu nhiên từ quizzes
    const randomIndex = Math.floor(Math.random() * quizzes.length);
    const selectedQuiz = quizzes[randomIndex];
    setTiebreakerQuiz(selectedQuiz);
    
    // Lọc các tùy chọn chỉ giữ lại những tùy chọn có skinType thuộc tiedTypes
    if (selectedQuiz.answerOptionDTOS) {
      const filteredOptions = selectedQuiz.answerOptionDTOS.filter(
        option => tiedTypes.includes(option.skinType)
      );
      
      // Đảm bảo mỗi loại da chỉ xuất hiện một lần
      const uniqueOptions: any[] = [];
      const includedSkinTypes = new Set();
      
      filteredOptions.forEach(option => {
        if (!includedSkinTypes.has(option.skinType)) {
          uniqueOptions.push(option);
          includedSkinTypes.add(option.skinType);
        }
      });
      
      setTiebreakerOptions(uniqueOptions);
    }
  };

  const handleNextQuestion = () => {
    if (!currentSelection) return;
  
    if (showTiebreakerQuestion) {
      // Xử lý khi người dùng đã chọn câu trả lời cho câu hỏi quyết định
      const selectedOption = tiebreakerOptions.find(
        (option) => option.optionText === currentSelection
      );
      
      if (selectedOption) {
        // Chuyển đến trang kết quả với loại da được chọn từ câu hỏi quyết định
        router.push(`/skin-quiz/results?skinType=${selectedOption.skinType}`);
      }
    } else {
      // Xử lý câu hỏi thông thường
      const selectedOption = currentQuiz.answerOptionDTOS?.find(
        (option) => option.optionText === currentSelection
      );
    
      if (selectedOption) {
        // Lưu câu trả lời
        setSelectedAnswers((prev) => [...prev, selectedOption.optionText]);
        setSkinTypeCounts((prev) => ({
          ...prev,
          [selectedOption.skinType]: (prev[selectedOption.skinType] || 0) + 1,
        }));
    
        // Chuyển đến câu hỏi tiếp theo hoặc kiểm tra kết quả
        if (currentQuestionIndex < quizzes.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setCurrentSelection(null);
        } else {
          // Kiểm tra xem có hòa không
          const maxCount = Math.max(...Object.values(skinTypeCounts));
          const tiedTypes = Object.keys(skinTypeCounts).filter(
            skinType => skinTypeCounts[skinType] === maxCount
          );
          
          if (tiedTypes.length > 1) {
            // Có sự hòa - hiển thị câu hỏi quyết định
            setTiedSkinTypes(tiedTypes);
            setShowTiebreakerQuestion(true);
            selectRandomTiebreakerQuestion(tiedTypes);
            setCurrentSelection(null);
          } else {
            // Không có hòa - chuyển đến trang kết quả
            router.push(`/skin-quiz/results?skinType=${tiedTypes[0]}`);
          }
        }
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (quizzes.length === 0 || (!showTiebreakerQuestion && !quizzes[currentQuestionIndex])) {
    return <div className="container mx-auto px-4 py-8">No quizzes available.</div>;
  }

  const currentQuiz = quizzes[currentQuestionIndex];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Bài kiểm tra loại da</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6">
            {showTiebreakerQuestion ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {tiebreakerQuiz?.quizText || "Câu hỏi quyết định"}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  Hãy chọn câu trả lời phù hợp nhất với bạn để xác định loại da chính xác.
                </p>
                <RadioGroup
                  value={currentSelection || ""}
                  onValueChange={(value) => setCurrentSelection(value)}
                  className="space-y-3"
                >
                  {tiebreakerOptions.length > 0 ? (
                    tiebreakerOptions.map((option) => (
                      <div key={option.optionID} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.optionText} id={option.optionID} />
                        <Label htmlFor={option.optionID}>{option.optionText}</Label>
                      </div>
                    ))
                  ) : (
                    <div>Không có tùy chọn khả dụng</div>
                  )}
                </RadioGroup>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">{currentQuiz.quizText}</h2>
                <RadioGroup
                  value={currentSelection || ""}
                  onValueChange={(value) => setCurrentSelection(value)}
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
                    <div>Không có tùy chọn khả dụng</div>
                  )}
                </RadioGroup>
              </>
            )}
          </div>
          <Button
            onClick={handleNextQuestion}
            disabled={!currentSelection}
            className="w-full"
          >
            {showTiebreakerQuestion 
              ? "Xem kết quả" 
              : currentQuestionIndex === quizzes.length - 1 
                ? "Xem kết quả" 
                : "Câu hỏi tiếp theo"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm text-gray-500">
        {showTiebreakerQuestion 
          ? "Câu hỏi quyết định"
          : `Câu hỏi ${currentQuestionIndex + 1} trong số ${quizzes.length}`}
      </div>
    </div>
  );
}
