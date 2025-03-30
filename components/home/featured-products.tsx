'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchProducts } from "@/app/api/productApi"

interface Product {
  id: string
  name: string
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
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
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
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-muted-foreground">For {product.skinType} skin</span>
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