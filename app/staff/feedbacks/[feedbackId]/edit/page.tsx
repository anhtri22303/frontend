"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
import { Feedback, updateFeedback, fetchFeedbackById } from "@/app/api/feedbackApi"

interface EditFeedbackPageProps {
  params: {
    feedbackId: string
  }
}

export default function EditFeedbackPage({ params }: EditFeedbackPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>({
    feedbackID: params.feedbackId,
    customerID: "",
    rating: 5,
    comment: "",
    feedbackDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await fetchFeedbackById(params.feedbackId)
        setFeedback(data)
      } catch (error) {
        console.error("Error loading feedback:", error)
        toast({
          title: "Error",
          description: "Failed to load feedback data. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFeedback()
  }, [params.feedbackId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await updateFeedback(params.feedbackId, feedback)
      toast({
        title: "Success",
        description: "Feedback has been updated successfully",
        duration: 3000,
      })
      router.push("/manager/feedbacks")
    } catch (error) {
      console.error("Error updating feedback:", error)
      toast({
        title: "Error",
        description: "Failed to update feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = (newRating: number) => {
    setFeedback({ ...feedback, rating: newRating })
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">Loading feedback data...</div>
      </div>
    )
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
          <CardTitle>Edit Feedback</CardTitle>
          <CardDescription>
            Update feedback information
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
                {isSubmitting ? "Saving..." : "Save Changes"}
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