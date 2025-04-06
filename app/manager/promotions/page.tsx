"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPromotions, deletePromotion, searchPromotionsByName, fetchPromotionById } from "@/app/api/promotionApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

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

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    setIsLoading(true)
    try {
      const data = await fetchPromotions()
      setPromotions(data)
    } catch (error) {
      console.error("Failed to load promotions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a promotion name to search.")
      return
    }
    setIsLoading(true)
    try {
      const response = await searchPromotionsByName(searchTerm)
      console.log("Search results:", response) // Kiểm tra dữ liệu trả về
      setPromotions(Array.isArray(response.data) ? response.data : []) // Truy cập vào `response.data`
    } catch (error) {
      console.error("Failed to search promotions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      try {
        await deletePromotion(id)
        await loadPromotions()
      } catch (error) {
        console.error("Failed to delete promotion:", error)
      }
    }
  }

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      alert("Please enter a promotion ID to search.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchPromotionById(searchId);
      console.log("Search by ID result:", response); // Kiểm tra dữ liệu trả về
      setPromotions(response ? [response] : []); // Hiển thị kết quả tìm kiếm
    } catch (error) {
      console.error("Failed to search promotion by ID:", error);
      setPromotions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSearchId("");
    loadPromotions();
  };

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(promotions) && promotions.map((promotion) => (
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
    </div>
  )
}