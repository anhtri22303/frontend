"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createFeedback } from "@/app/api/feedbackApi"

export default function CreateFeedbackPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({
    customerID: "",
    rating: 5,
    comment: "",
    feedbackDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await createFeedback(feedback)
      router.push("/manager/feedbacks")
    } catch (error) {
      console.error("Error creating feedback:", error)
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = (newRating: number) => {
    setFeedback({ ...feedback, rating: newRating })
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Feedbacks
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Feedback</CardTitle>
          <CardDescription>
            Add a new customer feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Customer ID
              </label>
              <Input
                required
                value={feedback.customerID}
                onChange={(e) =>
                  setFeedback({ ...feedback, customerID: e.target.value })
                }
                placeholder="Enter customer ID"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl transition-colors ${
                      star <= feedback.rating
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                    onClick={() => handleRatingChange(star)}
                    disabled={isSubmitting}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Comment
              </label>
              <Textarea
                required
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback({ ...feedback, comment: e.target.value })
                }
                placeholder="Enter your feedback comment"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Date
              </label>
              <Input
                type="date"
                required
                value={feedback.feedbackDate}
                onChange={(e) =>
                  setFeedback({ ...feedback, feedbackDate: e.target.value })
                }
                max={new Date().toISOString().split('T')[0]}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Feedback"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}