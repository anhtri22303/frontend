"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { fetchProducts } from "@/app/api/productApi"

const categories = ["All", "Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"]
const skinTypes = ["All", "Dry", "Oily", "Combination", "Normal", "Sensitive"]

interface Product {
  id: string;
  name: string;
  category: string;
  skinType: string[];
  price: number;
  rating: number;
  image: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSkinType, setSelectedSkinType] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        // Sử dụng dữ liệu tĩnh khi API không có dữ liệu trả về
        setProducts(staticProducts)
      }
    }

    getProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by category
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false
    }

    // Filter by skin type
    if (selectedSkinType !== "All" && !product.skinType.includes(selectedSkinType)) {
      return false
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price
    } else if (sortBy === "price-desc") {
      return b.price - a.price
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    }
    // Default: featured (no sorting)
    return 0
  })

  const addToCart = (product: Product) => {
    // Add product to cart (you can use local storage, context, or any state management library)
    let cart = JSON.parse(localStorage.getItem("cart") || "[]")
    cart.push(product)
    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Product added to cart")
    // Update cart count in header
    const event = new CustomEvent("cartUpdated", { detail: cart.length })
    window.dispatchEvent(event)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block w-64 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Skin Type</h3>
            <div className="space-y-2">
              {skinTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skin-${type}`}
                    checked={selectedSkinType === type}
                    onCheckedChange={() => setSelectedSkinType(type)}
                  />
                  <Label htmlFor={`skin-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider
              defaultValue={[0, 50]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex items-center justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Shop All Products</h1>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down products by category, skin type, and price.</SheetDescription>
                  </SheetHeader>

                  <div className="py-4 space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-category-${category}`}
                                  checked={selectedCategory === category}
                                  onCheckedChange={() => setSelectedCategory(category)}
                                />
                                <Label htmlFor={`mobile-category-${category}`}>{category}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="skin-type">
                        <AccordionTrigger>Skin Type</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {skinTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-skin-${type}`}
                                  checked={selectedSkinType === type}
                                  onCheckedChange={() => setSelectedSkinType(type)}
                                />
                                <Label htmlFor={`mobile-skin-${type}`}>{type}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                          <Slider
                            defaultValue={[0, 50]}
                            max={100}
                            step={1}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="mb-2"
                          />
                          <div className="flex items-center justify-between">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <Link href={`/shop/product/${product.id}`} className="block">
                    <div className="aspect-square relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/shop/product/${product.id}`} className="hover:underline">
                          <h3 className="font-medium">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <p className="font-semibold">${product.price}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-muted-foreground">For {product.skinType.join(", ")} skin</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => addToCart(product)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedSkinType("All")
                  setPriceRange([0, 50])
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const staticProducts: Product[] = [
  {
    id: "1",
    name: "Cleanser",
    category: "Cleanser",
    skinType: ["All"],
    price: 10,
    rating: 4.5,
    image: "/images/cleanser.jpg",
  },
  {
    id: "2",
    name: "Toner",
    category: "Toner",
    skinType: ["All"],
    price: 15,
    rating: 4.0,
    image: "/images/toner.jpg",
  },
  // Thêm các sản phẩm tĩnh khác ở đây
]

