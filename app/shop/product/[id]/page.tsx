"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock product data
const products = [
  {
    id: "1",
    name: "Hydrating Facial Cleanser",
    price: 24.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Cleanser",
    skinType: ["Dry", "Normal", "Sensitive"],
    rating: 4.8,
    reviewCount: 124,
    description:
      "A gentle, hydrating cleanser that effectively removes impurities without stripping the skin of its natural moisture. Formulated with hyaluronic acid and ceramides to maintain the skin's moisture barrier.",
    features: [
      "Removes makeup and impurities without drying the skin",
      "Hydrates with hyaluronic acid",
      "Strengthens skin barrier with ceramides",
      "Fragrance-free and suitable for sensitive skin",
      "Dermatologist tested and approved",
    ],
    ingredients:
      "Aqua, Glycerin, Sodium Cocoyl Isethionate, Sodium Lauroamphoacetate, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Hyaluronate, Disodium EDTA, Sodium Lauroyl Lactylate, Caprylic/Capric Triglyceride, Xanthan Gum, Carbomer, Sodium Hydroxide, Tocopherol, Phenoxyethanol, Ethylhexylglycerin.",
    howToUse:
      "Apply to damp face and neck. Gently massage in a circular motion, avoiding the eye area. Rinse thoroughly with lukewarm water. Use morning and evening.",
    size: "200ml",
    inStock: true,
    reviews: [
      {
        id: 1,
        user: "Sarah J.",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2 months ago",
        comment:
          "This cleanser is amazing! It leaves my skin feeling clean but not tight or dry. I have sensitive skin and this doesn't irritate it at all.",
      },
      {
        id: 2,
        user: "Michael T.",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Great product for my dry skin, especially during winter months. It's gentle and effective. Only giving 4 stars because I wish it came in a larger size.",
      },
      {
        id: 3,
        user: "Emily R.",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "1 month ago",
        comment:
          "I've tried many cleansers and this is by far the best for my combination skin. It doesn't break me out and leaves my skin feeling balanced.",
      },
    ],
    relatedProducts: [2, 3, 5, 11],
  },
]

// Mock related products
const relatedProductsData = [
  {
    id: 2,
    name: "Vitamin C Brightening Serum",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
  },
  {
    id: 3,
    name: "Oil-Free Moisturizer",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Moisturizer",
  },
  {
    id: 5,
    name: "Hyaluronic Acid Serum",
    price: 42.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
  },
  {
    id: 11,
    name: "Hydrating Toner",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Toner",
  },
]

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  // In a real app, you would fetch the product data based on the ID
  const product = products.find((p) => p.id === productId) || products[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square w-20 rounded-md overflow-hidden border ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold">${product.price}</div>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <h3 className="font-medium mb-2">Skin Type</h3>
            <div className="flex flex-wrap gap-2">
              {product.skinType.map((type) => (
                <span key={type} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <Select defaultValue={product.size}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100ml">100ml</SelectItem>
                <SelectItem value="200ml">200ml</SelectItem>
                <SelectItem value="300ml">300ml</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button className="flex-1" disabled={!product.inStock}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {product.inStock ? (
            <p className="text-green-600 text-sm">In Stock</p>
          ) : (
            <p className="text-red-600 text-sm">Out of Stock</p>
          )}
        </div>
      </div>

      {/* Product Information Tabs */}
      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Ingredients
          </TabsTrigger>
          <TabsTrigger
            value="how-to-use"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            How to Use
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <p className="text-muted-foreground leading-relaxed">{product.ingredients}</p>
          </div>
        </TabsContent>

        <TabsContent value="how-to-use" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How to Use</h3>
            <p className="text-muted-foreground leading-relaxed">{product.howToUse}</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>

            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.user} />
                      <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.user}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>

                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-primary fill-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground">{review.comment}</p>

                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProductsData.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/shop/product/${product.id}`} className="block">
                <div className="aspect-square relative">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/shop/product/${product.id}`} className="hover:underline">
                  <h3 className="font-medium">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="font-semibold mt-2">${product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

