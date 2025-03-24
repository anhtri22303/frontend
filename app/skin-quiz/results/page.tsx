"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchRoutinesByCategory } from "@/app/api/routineApi"
import { fetchProductsByCategory } from "@/app/api/productApi"

interface Product {
  productID: string
  productName: string
  description: string
  price: number
  category: string
  rating: number
  image_url: string
}

interface Routine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

export default function QuizResults() {
  const searchParams = useSearchParams()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const skinType = searchParams.get("skinType")
  const routinePreference = searchParams.get("routinePreference")
  const timeOfDay = searchParams.get("timeOfDay")

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Convert routine preference to category format
        let routineCategory = "basic"
        if (routinePreference === "Moderate (4-5 steps)") {
          routineCategory = "moderate"
        } else if (routinePreference === "Advanced (6+ steps)") {
          routineCategory = "advanced"
        }

        // Save user preferences to localStorage
        localStorage.setItem("userSkinType", skinType || "")
        localStorage.setItem("userRoutinePreference", routinePreference || "")
        localStorage.setItem("userTimeOfDay", timeOfDay || "")

        // Fetch routines based on skin type and preference
        const routineResults = await fetchRoutinesByCategory(`${skinType?.toLowerCase()}-${routineCategory}`)
        setRoutines(routineResults)

        // Fetch products for the skin type
        const productResults = await fetchProductsByCategory(skinType?.toLowerCase() || "")
        setProducts(productResults)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (skinType && routinePreference) {
      fetchResults()
    }
  }, [skinType, routinePreference])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your personalized recommendations...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Personalized Skin Care Recommendations</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-2">
              <li>
                <strong>Skin Type:</strong> {skinType}
              </li>
              <li>
                <strong>Routine Preference:</strong> {routinePreference}
              </li>
              <li>
                <strong>Time of Day:</strong> {timeOfDay}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

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

      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <Card key={product.productID}>
              <CardHeader>
                <CardTitle>{product.productName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative mb-4">
                  {product.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.productName}
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>
                <p className="mb-2">{product.description}</p>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
                <div className="mt-2">Rating: {product.rating}/5</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
