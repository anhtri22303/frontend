"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchPromotionById, updatePromotion } from "@/app/api/promotionApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function EditPromotion({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    promotionName: "",
    discount: 0,
    startDate: "",
    endDate: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const data = await fetchPromotionById(params.id)
        setFormData({
          promotionName: data.promotionName,
          discount: data.discount,
          startDate: data.startDate.split('T')[0],
          endDate: data.endDate.split('T')[0]
        })
      } catch (error) {
        console.error("Failed to load promotion:", error)
        router.push("/manager/promotions")
      }
    }
    loadPromotion()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updatePromotion(params.id, formData)
      router.push("/manager/promotions")
    } catch (error) {
      console.error("Failed to update promotion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Promotion Name</label>
              <Input
                value={formData.promotionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, promotionName: e.target.value })}
                placeholder="Enter promotion name"
                required
              />
            </div>

            <div className="space-y-2">
              <label>Discount (%)</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, discount: Number(e.target.value) })}
                placeholder="Enter discount percentage"
                required
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <label>Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label>End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}