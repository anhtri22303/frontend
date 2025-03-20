"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPromotions, deletePromotion } from "@/app/api/promotionApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface Promotion {
  promotionID: string
  promotionName: string
  discount: number
  startDate: string
  endDate: string
}

export default function PromotionsPage() {  // Changed function name to match page convention
  const router = useRouter()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button onClick={() => router.push('/manager/promotions/create')}>
          Create New Promotion
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <Card key={promotion.promotionID}>
            <CardHeader>
              <CardTitle>{promotion.promotionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold mb-2">{promotion.discount}% OFF</p>
              <p className="text-sm text-muted-foreground">
                Valid from {format(new Date(promotion.startDate), 'PP')} to{' '}
                {format(new Date(promotion.endDate), 'PP')}
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/manager/promotions/update/${promotion.promotionID}`)}
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