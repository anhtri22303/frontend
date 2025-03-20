"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchProducts, deleteProduct, fetchProductsByCategory, fetchProductsByName } from "@/app/api/productApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addToCart } from "@/app/api/cartApi"

interface Product {
  id: string
  name: string
  category: string
  price: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchName, setSearchName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const categories = ["DRY", "OILY", "COMBINATION", "SENSITIVE", "NORMAL"]

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      console.error("User ID not found in localStorage")
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      loadProducts()
      return
    }
    try {
      const data = await fetchProductsByName(searchName)
      setProducts(data)
    } catch (error) {
      console.error("Error searching products:", error)
    }
  }

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    if (category === "all") {
      loadProducts()
      return
    }
    try {
      const data = await fetchProductsByCategory(category)
      setProducts(data)
    } catch (error) {
      console.error("Error filtering products:", error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
        loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleAddToCart = async (product: Product) => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert("Please login to add items to cart")
      router.push("/login")
      return
    }

    try {
      await addToCart(userId, {
        productId: product.id,
        quantity: 1,
        price: parseFloat(product.price)
      })
      alert("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart")
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-4 w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-96"
            value={searchName}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchName(e.target.value)}
            onKeyDown={(e: { key: string }) => e.key === "Enter" && handleSearchByName()}
          />
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <Image
                src={`/placeholder.svg?height=150&width=150`}
                width={150}
                height={150}
                className="rounded-md object-cover w-full h-40"
                alt={`${product.name} thumbnail`}
              />
              <div className="mt-4">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-md font-semibold mt-2">${product.price}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/staff/products/edit/${product.id}`)}>
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/staff/products/edit/${product.id}`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full py-12">
            <h3 className="text-lg font-semibold">No Products Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </>
  )
}