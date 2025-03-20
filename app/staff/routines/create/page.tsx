"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRoutine } from "@/app/api/routineApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function CreateRoutinePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: "",
    routineName: "",
    routineDescription: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createRoutine(formData)
      router.push("/staff/routines")
    } catch (error) {
      console.error("Failed to create routine:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Routine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRY">Dry</SelectItem>
                  <SelectItem value="OILY">Oily</SelectItem>
                  <SelectItem value="COMBINATION">Combination</SelectItem>
                  <SelectItem value="SENSITIVE">Sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Routine Name</label>
              <Input
                value={formData.routineName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, routineName: e.target.value })}
                placeholder="Enter routine name"
              />
            </div>

            <div className="space-y-2">
              <label>Description</label>
              <Textarea
                value={formData.routineDescription}
                onChange={(e) => setFormData({ ...formData, routineDescription: e.target.value })}
                placeholder="Enter routine description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Routine"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}