"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"

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
import toast from "react-hot-toast"

export default function FeedbacksPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchFeedbackId, setSearchFeedbackId] = useState("")
  const [searchCustomerId, setSearchCustomerId] = useState("")
  const [searchProductId, setSearchProductId] = useState("")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 3 // Show 3 feedbacks per page

  useEffect(() => {
    loadFeedbacks()
  }, [])
  
  useEffect(() => {
    // Calculate total pages whenever feedbacks array changes
    setTotalPages(Math.ceil(feedbacks.length / itemsPerPage))
    // Reset to first page when data changes
    setCurrentPage(1)
  }, [feedbacks])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await fetchFeedbacks()
      setFeedbacks(Array.isArray(data) ? data : [])
      toast.success("Feedbacks loaded successfully")
    } catch (error) {
      console.error("Error loading feedbacks:", error)
      setFeedbacks([])
      toast.error("Failed to load feedbacks")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id)
      toast.success("Feedback deleted successfully")
      await loadFeedbacks() // Refresh the list
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast.error("Failed to delete feedback")
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
      toast.error("Please enter a Feedback ID to search.")
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbackById(searchFeedbackId);
      console.log("Feedback by id found:", response);
      setFeedbacks(response ? [response] : []);
      if (!response) {
        toast.error("No feedback found with that ID")
      } else {
        toast.success("Feedback found")
      }
    } catch (error) {
      console.error("Failed to search feedback by ID:", error);
      setFeedbacks([]);
      toast.error("Failed to search feedback by ID")
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCustomerID = async () => {
    if (!searchCustomerId.trim()) {
      toast.error("Please enter a Customer ID to search.")
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbacks(); // Lấy toàn bộ feedbacks
      const filteredFeedbacks = response.filter(
        (feedback: Feedback) => feedback.customerID === searchCustomerId.trim()
      );
      setFeedbacks(filteredFeedbacks); // Cập nhật danh sách feedbacks đã lọc
      toast.success(`Found ${filteredFeedbacks.length} feedbacks`)
    } catch (error) {
      console.error("Failed to search feedbacks by Customer ID:", error);
      setFeedbacks([]);
      toast.error("Failed to search feedbacks by Customer ID")
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByProductID = async () => {
    if (!searchProductId.trim()) {
      toast.error("Please enter a Product ID to search.")
      return;
    }
    setLoading(true);
    try {
      const response = await fetchFeedbacks(); // Lấy toàn bộ feedbacks
      const filteredFeedbacks = response.filter(
        (feedback: Feedback) => feedback.productID === searchProductId.trim()
      );
      setFeedbacks(filteredFeedbacks); // Cập nhật danh sách feedbacks đã lọc
      toast.success(`Found ${filteredFeedbacks.length} feedbacks`)
    } catch (error) {
      console.error("Failed to search feedbacks by Product ID:", error);
      setFeedbacks([]);
      toast.error("Failed to search feedbacks by Product ID")
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchFeedbackId("");
    setSearchCustomerId("");
    setSearchProductId("");
    await loadFeedbacks(); // Tải lại toàn bộ danh sách feedbacks
    toast.success("Filters reset")
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }
  
  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return feedbacks.slice(startIndex, endIndex)
  }

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always add first page
      pages.push(1)
      
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // Always add last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
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
          getCurrentPageData().map((feedback) => (
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
      
      {/* Pagination */}
      {!loading && feedbacks.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2">
                {page}
              </span>
            )
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Pagination Info */}
      {!loading && feedbacks.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {Math.min(feedbacks.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(feedbacks.length, currentPage * itemsPerPage)} of {feedbacks.length} feedbacks
        </div>
      )}
    </div>
  )
}