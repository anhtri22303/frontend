"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchUserById, updateUser } from "@/app/api/userManagerApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserFormData {
  fullName: string
  email: string
  phone: string
  address: string
  skinType: string
  loyalPoints: number
  role: string
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    skinType: "",
    loyalPoints: 0,
    role: ""
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById(params.id)
        if (userData) {
          setFormData({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            skinType: userData.skinType || "",
            loyalPoints: userData.loyalPoints || 0,
            role: userData.role || ""
          })
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        router.push("/manager/users")
      }
    }
    loadUser()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser(params.id, formData)
      router.push("/manager/users")
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="space-y-2">
              <label>Phone</label>
              <Input
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label>Address</label>
              <Input
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <label>Skin Type</label>
              <Select
                value={formData.skinType}
                onValueChange={(value) => setFormData({ ...formData, skinType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRY">Dry</SelectItem>
                  <SelectItem value="OILY">Oily</SelectItem>
                  <SelectItem value="COMBINATION">Combination</SelectItem>
                  <SelectItem value="SENSITIVE">Sensitive</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label>Loyal Points</label>
              <Input
                type="number"
                value={formData.loyalPoints}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, loyalPoints: Number(e.target.value) })}
                placeholder="Enter loyal points"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label>Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>  {/* Removed disabled and loading state */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}