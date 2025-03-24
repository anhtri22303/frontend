'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is your skin type?',
    options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
  },
  {
    id: 2,
    question: 'What kind of skincare routine do you prefer?',
    options: ['Basic (3 steps)', 'Moderate (4-5 steps)', 'Advanced (6+ steps)']
  },
  {
    id: 3,
    question: 'When do you typically do your skincare routine?',
    options: ['Morning', 'Night', 'Both morning and night']
  }
]

export default function SkinQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userID = localStorage.getItem('userID')
    if (!userID) {
      router.push('/login?redirect=/skin-quiz')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed, navigate to results with answers
      const queryParams = new URLSearchParams({
        skinType: answers[0] || '',
        routinePreference: answers[1] || '',
        timeOfDay: answers[2] || ''
      })
      router.push(`/skin-quiz/results?${queryParams.toString()}`)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Skin Care Quiz</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{currentQuestionData.question}</h2>
            <RadioGroup
              onValueChange={handleAnswer}
              value={answers[currentQuestion] || ''}
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
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm text-gray-500">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  )
}
