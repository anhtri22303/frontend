"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive"

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  skinType: SkinType[]
}

type RoutineStep = {
  id: number
  name: string
  description: string
  products: Product[]
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Gentle Hydrating Cleanser",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Cleanser",
    description: "A gentle, hydrating cleanser that removes impurities without stripping the skin.",
    skinType: ["dry", "sensitive", "normal"],
  },
  {
    id: 2,
    name: "Balancing Foam Cleanser",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Cleanser",
    description: "A foaming cleanser that removes excess oil and impurities for a balanced complexion.",
    skinType: ["oily", "combination"],
  },
  {
    id: 3,
    name: "Hydrating Toner",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Toner",
    description: "Alcohol-free toner that hydrates and preps skin for the next steps in your routine.",
    skinType: ["dry", "normal", "sensitive"],
  },
  {
    id: 4,
    name: "Oil Control Toner",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Toner",
    description: "Helps control oil production and minimize the appearance of pores.",
    skinType: ["oily", "combination"],
  },
  {
    id: 5,
    name: "Vitamin C Serum",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
    description: "Brightens skin and helps fade dark spots for a more even complexion.",
    skinType: ["normal", "dry", "combination", "oily"],
  },
  {
    id: 6,
    name: "Hyaluronic Acid Serum",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
    description: "Deeply hydrates and plumps skin with hyaluronic acid.",
    skinType: ["dry", "normal", "sensitive"],
  },
  {
    id: 7,
    name: "Niacinamide Serum",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Serum",
    description: "Reduces the appearance of pores and improves skin texture.",
    skinType: ["oily", "combination"],
  },
  {
    id: 8,
    name: "Rich Moisturizing Cream",
    price: 32.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Moisturizer",
    description: "A rich, nourishing cream that provides long-lasting hydration.",
    skinType: ["dry", "normal"],
  },
  {
    id: 9,
    name: "Oil-Free Gel Moisturizer",
    price: 28.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Moisturizer",
    description: "Lightweight, oil-free gel that hydrates without clogging pores.",
    skinType: ["oily", "combination"],
  },
  {
    id: 10,
    name: "Calming Moisturizer",
    price: 30.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Moisturizer",
    description: "Soothes and hydrates sensitive skin with calming ingredients.",
    skinType: ["sensitive"],
  },
  {
    id: 11,
    name: "Mineral Sunscreen SPF 50",
    price: 26.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sunscreen",
    description: "Broad-spectrum mineral sunscreen suitable for sensitive skin.",
    skinType: ["sensitive", "dry", "normal"],
  },
  {
    id: 12,
    name: "Lightweight Sunscreen SPF 30",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sunscreen",
    description: "Lightweight, non-greasy sunscreen that won't clog pores.",
    skinType: ["oily", "combination"],
  },
]

export default function SkinQuizResultsPage() {
  const searchParams = useSearchParams()
  const [skinType, setSkinType] = useState<SkinType>("normal")
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([])

  useEffect(() => {
    // Analyze quiz answers to determine skin type
    // This is a simplified version - in a real app, you'd have more complex logic
    const q0 = searchParams.get("q0")
    if (q0 && ["dry", "oily", "combination", "normal", "sensitive"].includes(q0)) {
      setSkinType(q0 as SkinType)
    }

    // Create personalized routine based on skin type
    const cleanserProducts = mockProducts.filter((p) => p.category === "Cleanser" && p.skinType.includes(skinType))

    const tonerProducts = mockProducts.filter((p) => p.category === "Toner" && p.skinType.includes(skinType))

    const serumProducts = mockProducts.filter((p) => p.category === "Serum" && p.skinType.includes(skinType))

    const moisturizerProducts = mockProducts.filter(
      (p) => p.category === "Moisturizer" && p.skinType.includes(skinType),
    )

    const sunscreenProducts = mockProducts.filter((p) => p.category === "Sunscreen" && p.skinType.includes(skinType))

    setRoutineSteps([
      {
        id: 1,
        name: "Cleanse",
        description: "Start with a clean canvas by removing dirt, oil, and impurities.",
        products: cleanserProducts,
      },
      {
        id: 2,
        name: "Tone",
        description: "Balance your skin's pH and prepare it for treatments.",
        products: tonerProducts,
      },
      {
        id: 3,
        name: "Treat",
        description: "Target specific skin concerns with concentrated ingredients.",
        products: serumProducts,
      },
      {
        id: 4,
        name: "Moisturize",
        description: "Lock in hydration and strengthen your skin barrier.",
        products: moisturizerProducts,
      },
      {
        id: 5,
        name: "Protect",
        description: "Shield your skin from UV damage with daily sunscreen.",
        products: sunscreenProducts,
      },
    ])
  }, [searchParams, skinType])

  const skinTypeDescriptions = {
    dry: "Your skin tends to be dry and may feel tight or flaky. Focus on hydrating products that restore moisture.",
    oily: "Your skin produces excess oil, especially in the T-zone. Look for oil-controlling and non-comedogenic products.",
    combination:
      "You have both oily and dry areas. Your T-zone (forehead, nose, chin) is oily, while cheeks are normal to dry.",
    normal: "Your skin is well-balanced - neither too oily nor too dry. Focus on maintaining this balance.",
    sensitive:
      "Your skin reacts easily to products and environmental factors. Stick to gentle, fragrance-free formulations.",
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your Personalized Skincare Results</h1>
        <div className="p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Your Skin Type: {skinType.charAt(0).toUpperCase() + skinType.slice(1)}
          </h2>
          <p className="text-muted-foreground">{skinTypeDescriptions[skinType]}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-6">Your Recommended Routine</h2>

      <Tabs defaultValue="routine" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="routine">Daily Routine</TabsTrigger>
          <TabsTrigger value="products">Recommended Products</TabsTrigger>
        </TabsList>

        <TabsContent value="routine">
          <div className="space-y-8">
            {routineSteps.map((step) => (
              <div key={step.id} className="border-b pb-8 last:border-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.name}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {step.products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button asChild variant="outline" size="sm" className="w-full">
                          <Link href={`/shop/product/${product.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter((product) => product.skinType.includes(skinType))
              .map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">${product.price}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/shop/product/${product.id}`}>View</Link>
                    </Button>
                    <Button size="sm" className="w-full">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">Want to explore more products for your skin type?</p>
        <Button asChild size="lg">
          <Link href="/shop">Shop All Products</Link>
        </Button>
      </div>
    </div>
  )
}

