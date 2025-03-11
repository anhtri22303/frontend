"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

const quizQuestions = [
  {
    id: 1,
    question: "How would you describe your skin type?",
    options: [
      { id: "dry", label: "Dry - Often feels tight or flaky" },
      { id: "oily", label: "Oily - Shiny, especially in the T-zone" },
      { id: "combination", label: "Combination - Oily T-zone, dry cheeks" },
      { id: "normal", label: "Normal - Neither too oily nor too dry" },
      { id: "sensitive", label: "Sensitive - Easily irritated or reddened" },
    ],
  },
  {
    id: 2,
    question: "What skin concerns do you want to address?",
    options: [
      { id: "acne", label: "Acne and breakouts" },
      { id: "aging", label: "Fine lines and wrinkles" },
      { id: "dark-spots", label: "Dark spots and hyperpigmentation" },
      { id: "dullness", label: "Dullness and uneven texture" },
      { id: "redness", label: "Redness and inflammation" },
    ],
  },
  {
    id: 3,
    question: "How does your skin feel after cleansing?",
    options: [
      { id: "tight", label: "Tight and dry" },
      { id: "comfortable", label: "Comfortable and balanced" },
      { id: "still-oily", label: "Still somewhat oily" },
      { id: "irritated", label: "Irritated or sensitive" },
    ],
  },
  {
    id: 4,
    question: "How often do you experience breakouts?",
    options: [
      { id: "never", label: "Rarely or never" },
      { id: "occasionally", label: "Occasionally (once a month)" },
      { id: "frequently", label: "Frequently (weekly)" },
      { id: "constantly", label: "Constantly dealing with breakouts" },
    ],
  },
  {
    id: 5,
    question: "What is your current skincare routine like?",
    options: [
      { id: "minimal", label: "Minimal - Just cleansing" },
      { id: "basic", label: "Basic - Cleansing and moisturizing" },
      { id: "moderate", label: "Moderate - Cleansing, toning, and moisturizing" },
      { id: "extensive", label: "Extensive - Multiple steps and products" },
    ],
  },
]

export default function SkinQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [currentQuestion]: selectedOption })

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Quiz completed, navigate to results
        router.push(
          `/skin-quiz/results?${new URLSearchParams(
            Object.entries(answers).map(([key, value]) => [`q${key}`, value]),
          )}`,
        )
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1] || null)
    }
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Skin Type Quiz</h1>
        <p className="text-muted-foreground">
          Answer a few questions to discover your skin type and get personalized product recommendations
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
          <CardDescription>Select the option that best describes your skin</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer flex-1 py-2">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedOption}>
            {currentQuestion < quizQuestions.length - 1 ? "Next" : "See Results"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

