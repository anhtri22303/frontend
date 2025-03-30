"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchRoutinesByCategory } from "@/app/api/routineApi"
import { fetchProductsByCategory } from "@/app/api/productApi"
import { Button } from "@/components/ui/button"

interface Routine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

interface Product {
  id: string
  productName: string
  description: string
  price: number
  image_url: string
}

export default function QuizResults() {
  const searchParams = useSearchParams()
  const skinTypes = searchParams.get("skinTypes")?.split(",") || []
  const categories = searchParams.get("categories")?.split(",") || []
  const [routines, setRoutines] = useState<Routine[]>([])
  const [products, setProducts] = useState<Product[]>([]) // Khởi tạo với mảng rỗng
  const [loading, setLoading] = useState(true)

  const skinType = searchParams.get("skinType")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!skinType) return

        // Fetch routines for the given skin type
        const routineResults = await fetchRoutinesByCategory(skinType.toUpperCase())
        const filteredRoutines = routineResults.filter(
          (routine: Routine) => routine.category.toUpperCase() === skinType.toUpperCase()
        )
        setRoutines(filteredRoutines)

        // Fetch products for the given skin type
        const productResults = await fetchProductsByCategory(skinType.toUpperCase())
        setProducts(productResults)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [skinType])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your personalized recommendations...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Quiz Results</h1>

      {/* Hiển thị Skin Types */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Skin Type</h2>
        <div className="flex gap-2">
          {skinTypes.map((type) => (
            <span
              key={type}
              className="px-3 py-1 text-sm border rounded-md text-muted-foreground"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Hiển thị Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Preferred Categories</h2>
        <div className="flex gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-sm border rounded-md text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Routines Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Routines</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map((routine) => (
            <Card key={routine.routineID}>
              <CardHeader>
                <CardTitle>{routine.routineName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{routine.routineDescription}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(products) && products.map((product) => (
            <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate">{product.productName}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <Button
                  variant="outline"
                  className="mt-4 w-full text-sm font-medium text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}