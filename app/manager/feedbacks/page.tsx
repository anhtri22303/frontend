"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus, Search } from "lucide-react"

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
import { Input } from "@/components/ui/input"

import { Feedback, fetchFeedbacks, deleteFeedback, fetchFeedbackById } from "@/app/api/feedbackApi"

export default function FeedbacksPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFeedbackId, setSearchFeedbackId] = useState("")
  const [searchCustomerId, setSearchCustomerId] = useState("")
  const [searchProductId, setSearchProductId] = useState("")

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
    router.push(`/manager/feedbacks/${feedback.feedbackID}/edit?customerID=${feedback.customerID}&productID=${feedback.productID}&rating=${feedback.rating}&comment=${encodeURIComponent(feedback.comment)}`)
  }

  const handleCreate = () => {
    router.push("/manager/feedbacks/create")
  }

  const handleSearchByFeedbackId = async () => {
    if (!searchFeedbackId.trim()) {
      alert("Please enter a Feedback ID to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbackById(searchFeedbackId);
      console.log("Feedback by id found:", response);
      setFeedbacks(response ? [response] : []);
    } catch (error) {
      console.error("Failed to search feedback by ID:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCustomerID = async () => {
    if (!searchCustomerId.trim()) {
      alert("Please enter a Customer ID to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbacks(); // Lấy toàn bộ feedbacks
      const filteredFeedbacks = response.filter(
        (feedback: Feedback) => feedback.customerID === searchCustomerId.trim()
      );
      setFeedbacks(filteredFeedbacks); // Cập nhật danh sách feedbacks đã lọc
    } catch (error) {
      console.error("Failed to search feedbacks by Customer ID:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByProductID = async () => {
    if (!searchProductId.trim()) {
      alert("Please enter a Product ID to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbacks(); // Lấy toàn bộ feedbacks
      const filteredFeedbacks = response.filter(
        (feedback: Feedback) => feedback.productID === searchProductId.trim()
      );
      setFeedbacks(filteredFeedbacks); // Cập nhật danh sách feedbacks đã lọc
    } catch (error) {
      console.error("Failed to search feedbacks by Product ID:", error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchFeedbackId("");
    setSearchCustomerId("");
    setSearchProductId("");
    await loadFeedbacks(); // Tải lại toàn bộ danh sách feedbacks
  };

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
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Feedback
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {/* Filter by Feedback ID */}
        <Input
          value={searchFeedbackId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFeedbackId(e.target.value)}
          placeholder="Enter Feedback ID"
        />
        <Button onClick={handleSearchByFeedbackId} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>

        {/* Filter by Customer ID */}
        <Input
          value={searchCustomerId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCustomerId(e.target.value)}
          placeholder="Enter Customer ID"
        />
        <Button onClick={handleSearchByCustomerID} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>

        {/* Filter by Product ID */}
        <Input
          value={searchProductId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchProductId(e.target.value)}
          placeholder="Enter Product ID"
        />
        <Button onClick={handleSearchByProductID} disabled={loading}>
          <Search className="h-4 w-4" />
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
                    <CardDescription>Product ID: {feedback.productID}</CardDescription> {/* Hiển thị productID */}
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