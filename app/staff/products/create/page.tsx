"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct } from "@/app/api/productApi"

export default function CreateProductPage() {
  const [newProduct, setNewProduct] = useState({
    productID: "",
    productName: "",
    description: "",
    price: 0,
    category: "DRY",
    rating: 0,
    image_url: ""
  })
  const router = useRouter()

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct)
      router.push("/staff/products")
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium mb-1 block">Product ID</label>
          <Input
            placeholder="Enter product ID"
            value={newProduct.productID}
            onChange={(e: { target: { value: any } }) => setNewProduct({ ...newProduct, productID: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Product Name</label>
          <Input
            placeholder="Enter product name"
            value={newProduct.productName}
            onChange={(e: { target: { value: any } }) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Textarea
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Price</label>
          <Input
            type="number"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e: { target: { value: any } }) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={newProduct.category}
            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRY">DRY</SelectItem>
              <SelectItem value="OILY">OILY</SelectItem>
              <SelectItem value="COMBINATION">COMBINATION</SelectItem>
              <SelectItem value="SENSITIVE">SENSITIVE</SelectItem>
              <SelectItem value="NORMAL">NORMAL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Rating</label>
          <Input
            type="number"
            placeholder="Enter rating"
            value={newProduct.rating}
            onChange={(e: { target: { value: any } }) => setNewProduct({ ...newProduct, rating: Number(e.target.value) })}
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Image URL</label>
          <Input
            placeholder="Enter image URL"
            value={newProduct.image_url}
            onChange={(e: { target: { value: any } }) => setNewProduct({ ...newProduct, image_url: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => router.push("/staff/products")}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct}>Create Product</Button>
      </div>
    </div>
  )
}