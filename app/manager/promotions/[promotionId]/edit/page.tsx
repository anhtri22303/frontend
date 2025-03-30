"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Promotion, updatePromotion, fetchPromotionById } from "@/app/api/promotionApi"

interface EditPromotionPageProps {
  params: {
    promotionId: string
  }
}

export default function EditPromotionPage({ params }: EditPromotionPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promotion, setPromotion] = useState<Promotion>({
    promotionID: params.promotionId,
    promotionName: "",
    productID: "", // Added productID
    discount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const response = await fetchPromotionById(params.promotionId) // Lấy dữ liệu từ API
        setPromotion(response.data) // Chỉ gán trường `data` vào state
      } catch (error) {
        console.error("Error loading promotion:", error)
        toast({
          title: "Error",
          description: "Failed to load promotion data. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPromotion()
  }, [params.promotionId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await updatePromotion(params.promotionId, promotion)
      toast({
        title: "Success",
        description: "Promotion has been updated successfully",
        duration: 3000,
      })
      router.push("/manager/promotions")
    } catch (error) {
      console.error("Error updating promotion:", error)
      toast({
        title: "Error",
        description: "Failed to update promotion. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">Loading promotion data...</div>
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
        Back to Promotions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Promotion</CardTitle>
          <CardDescription>
            Update promotion information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
              Promotion Name
              </label>
              <Input
              required
              value={promotion.promotionName} // Hiển thị tên promotion
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromotion({ ...promotion, promotionName: e.target.value })
              }
              placeholder="Enter promotion name"
              disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
              Discount (%)
              </label>
              <Input
              type="number"
              required
              min={0}
              max={100}
              value={promotion.discount} // Hiển thị discount
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromotion({ ...promotion, discount: parseFloat(e.target.value) })
              }
              placeholder="Enter discount percentage"
              disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
              Start Date
              </label>
              <Input
              type="date"
              required
              value={promotion.startDate} // Hiển thị ngày bắt đầu
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromotion({ ...promotion, startDate: e.target.value })
              }
              disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
              End Date
              </label>
              <Input
              type="date"
              required
              value={promotion.endDate} // Hiển thị ngày kết thúc
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromotion({ ...promotion, endDate: e.target.value })
              }
              min={promotion.startDate}
              disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
              Product ID
              </label>
              <Input
              required
              value={promotion.productID} // Hiển thị productID
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPromotion({ ...promotion, productID: e.target.value })
              }
              placeholder="Enter product ID"
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