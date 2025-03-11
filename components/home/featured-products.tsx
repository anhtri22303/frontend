import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const featuredProducts = [
  {
    id: 1,
    name: "Hydrating Facial Cleanser",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Cleanser",
    rating: 4.8,
    skinType: "Dry",
    isNew: true,
  },
  {
    id: 2,
    name: "Vitamin C Brightening Serum",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
    rating: 4.9,
    skinType: "All",
    isNew: false,
  },
  {
    id: 3,
    name: "Oil-Free Moisturizer",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Moisturizer",
    rating: 4.7,
    skinType: "Oily",
    isNew: false,
  },
  {
    id: 4,
    name: "Gentle Exfoliating Mask",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Mask",
    rating: 4.6,
    skinType: "Sensitive",
    isNew: true,
  },
]

export function FeaturedProducts() {
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
        {featuredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg"}
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
                <p className="font-semibold">${product.price}</p>
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

