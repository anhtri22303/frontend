"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPromotion } from "@/app/api/promotionApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CreatePromotion() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    promotionName: "",
    discount: 0,
    startDate: "",
    endDate: "",
    productID: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createPromotion(formData)
      router.push("/manager/promotions")
    } catch (error) {
      console.error("Failed to create promotion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Promotion</CardTitle>
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

            <div className="space-y-2">
              <label>Product ID</label>
              <Input
                value={formData.productID}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, productID: e.target.value })}
                placeholder="Enter product ID"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}