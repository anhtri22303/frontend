"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPromotions, deletePromotion, searchPromotionsByName, fetchPromotionById } from "@/app/api/promotionApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

interface Promotion {
  promotionID: string
  promotionName: string
  discount: number
  startDate: string
  endDate: string
  productIDs: string[] // Changed from productID to productIDs
}

export default function PromotionsPage() {
  const router = useRouter()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchId, setSearchId] = useState("")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    loadPromotions()
  }, [])

  useEffect(() => {
    // Calculate total pages whenever promotions array changes
    setTotalPages(Math.ceil(promotions.length / itemsPerPage))
    // Reset to first page when data changes
    setCurrentPage(1)
  }, [promotions])

  const loadPromotions = async () => {
    setIsLoading(true)
    try {
      const data = await fetchPromotions()
      setPromotions(data)
      toast.success("Promotions loaded successfully")
    } catch (error) {
      console.error("Failed to load promotions:", error)
      toast.error("Failed to load promotions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a promotion name to search.")
      return
    }
    setIsLoading(true)
    try {
      const response = await searchPromotionsByName(searchTerm)
      console.log("Search results:", response)
      setPromotions(Array.isArray(response.data) ? response.data : [])
      toast.success(`Found ${Array.isArray(response.data) ? response.data.length : 0} promotions`)
    } catch (error) {
      console.error("Failed to search promotions:", error)
      toast.error("Failed to search promotions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      try {
        await deletePromotion(id)
        toast.success("Promotion deleted successfully")
        await loadPromotions()
      } catch (error) {
        console.error("Failed to delete promotion:", error)
        toast.error("Failed to delete promotion")
      }
    }
  }

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a promotion ID to search.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchPromotionById(searchId);
      console.log("Search by ID result:", response);
      setPromotions(response ? [response] : []);
      if (response) {
        toast.success("Promotion found")
      } else {
        toast.error("No promotion found with that ID")
      }
    } catch (error) {
      console.error("Failed to search promotion by ID:", error);
      setPromotions([]);
      toast.error("Failed to search promotion by ID")
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchId("");
    loadPromotions();
    toast.success("Filters reset")
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return promotions.slice(startIndex, endIndex)
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={() => router.push('/manager/promotions/create')}>
            Create New Promotion
          </Button>
        </div>
      </div>

      {/* Khung nhập và nút tìm kiếm */}
      <div className="flex gap-4 mb-6">
        {/* Filter by Promotion Name */}
        <Input
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder="Enter promotion name"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>

        {/* Filter by Promotion ID */}
        <Input
          value={searchId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
          placeholder="Enter promotion ID"
        />
        <Button onClick={handleSearchById} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search by ID"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading promotions...</div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No promotions found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(promotions) && getCurrentPageData().map((promotion) => (
              <Card key={promotion.promotionID}>
                <CardHeader>
                  <CardTitle>{promotion.promotionName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold mb-2">{promotion.discount}% OFF</p>
                  {/* Hiển thị Promotion ID */}
                  <p className="text-sm text-muted-foreground">
                    Promotion ID: {promotion.promotionID}
                  </p>
                  
                  {/* Display all product IDs */}
                  <div className="text-sm text-muted-foreground mt-2">
                    <p className="font-medium mb-1">Products:</p>
                    {promotion.productIDs && Array.isArray(promotion.productIDs) && promotion.productIDs.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {promotion.productIDs.map((id, index) => (
                          <span key={index} className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                            {id}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs italic">No products assigned</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Valid from{" "}
                    {promotion.startDate
                      ? format(new Date(promotion.startDate), "PP")
                      : "N/A"}{" "}
                    to{" "}
                    {promotion.endDate
                      ? format(new Date(promotion.endDate), "PP")
                      : "N/A"}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/manager/promotions/${promotion.promotionID}/edit`)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(promotion.promotionID)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {promotions.length > itemsPerPage && (
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
          {promotions.length > 0 && (
            <div className="text-center text-sm text-gray-500 mt-2">
              Showing {Math.min(promotions.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(promotions.length, currentPage * itemsPerPage)} of {promotions.length} promotions
            </div>
          )}
        </>
      )}
    </div>
  )
}