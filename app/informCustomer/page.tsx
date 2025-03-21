"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCustomer } from "@/app/api/customerApi"

export default function InformCustomerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",  // Changed from fullName to match Customer interface
    email: "",
    phone: "",
    address: "",
    skinType: "NORMAL"  // Added required field with default value
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userID = localStorage.getItem("userID")

    try {
      const response = await updateCustomer(userID! ,formData)
      if (response) {
        alert("Customer information saved successfully!")
        router.push("/cart") // Changed to redirect back to cart
      } else {
        alert("Failed to save customer information")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      alert("An error occurred while saving customer information")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Customer Information</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"  // Changed from fullName to name
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your address"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
        >
          Save Information
        </Button>
      </form>
    </div>
  )
}