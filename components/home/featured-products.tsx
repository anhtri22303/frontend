'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchProducts } from "@/app/api/productApi"

interface Product {
  productID: string
  productName: string
  price: number
  image_url: string
  category: string
  rating: number
  skinType: string
  isNew: boolean
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts()
        console.log("Products data:", data)
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="container py-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Featured Products</h2>
        <p className="text-center">Loading products...</p>
      </section>
    )
  }

  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground mt-2">Our most popular skincare solutions loved by customers</p>
        </div>
        <Button asChild variant="outline" className="mt-4 md:mt-0">
          <Link href="/shop">View All Products</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.productID} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.productName}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {product.isNew && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  New
                </Badge>
              )}
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{product.productName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {product.productID}</p>
                </div>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              </div>
              <div className="mt-2 text-sm">
                <p>Category: {product.category}</p>
                <p>For {product.skinType} skin</p>
                <div className="flex items-center mt-1">
                  <span>Rating: {product.rating}/5</span>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}