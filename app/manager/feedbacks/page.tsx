"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Feedback, fetchFeedbacks, deleteFeedback } from "@/app/api/feedbackApi"

export default function FeedbacksPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await fetchFeedbacks()
      setFeedbacks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading feedbacks:", error)
      setFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id)
      await loadFeedbacks() // Refresh the list
    } catch (error) {
      console.error("Error deleting feedback:", error)
    }
  }

  const handleEdit = (feedback: Feedback) => {
    // Pass feedback data through router state
    router.push(`/manager/feedbacks/${feedback.feedbackID}/edit`, {
      state: { feedback }
    })
  }

  const handleCreate = () => {
    router.push("/manager/feedbacks/create")
  }

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Feedbacks</h1>
        </div>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feedbacks</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Feedback
        </Button>
      </div>

      <div className="grid gap-6">
        {feedbacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No feedbacks found
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <Card key={feedback.feedbackID}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Customer ID: {feedback.customerID}</CardTitle>
                    <CardDescription>
                      Date: {new Date(feedback.feedbackDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-xl text-yellow-500">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{feedback.comment}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(feedback)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this feedback? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(feedback.feedbackID)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}