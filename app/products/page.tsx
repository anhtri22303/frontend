"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchProducts, fetchProductsByCategory } from "@/app/api/productApi"

interface Product {
  productID: string
  productName: string
  description: string
  price: number
  category: string
  rating: number
  image_url: string
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const categories = ["Dry", "Oily", "Combination", "Sensitive", "Normal", "All"]

  useEffect(() => {
    loadProducts()
  }, [selectedCategory])

  const loadProducts = async () => {
    try {
      let response
      if (selectedCategory && selectedCategory !== "All") {
        response = await fetchProductsByCategory(selectedCategory)
      } else {
        response = await fetchProducts()
      }
      setProducts(response.data)
    } catch (error) {
      console.error("Failed to load products:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.productID} className="border rounded-lg p-4">
            <img 
              src={product.image_url} 
              alt={product.productName}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{product.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}