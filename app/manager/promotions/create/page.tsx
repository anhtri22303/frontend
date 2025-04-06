"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPromotion } from "@/app/api/promotionApi"
import { fetchProducts } from "@/app/api/productApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  productID: string;
  productName: string;
  description?: string;
  price: number;
  image_url?: string;
  skinType?: string;
  category?: string;
}

export default function CreatePromotion() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    promotionName: "",
    discount: 0,
    startDate: "",
    endDate: "",
    productIDs: [] as string[] // Changed from productID to productIDs
  })
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProductIDs, setSelectedProductIDs] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  // Fetch all products when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data || [])
      } catch (error) {
        console.error("Failed to load products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      }
    }
    
    loadProducts()
  }, [toast])

  // Group products by skinType
  const groupedProducts = products.reduce((acc, product) => {
    const skinType = product.skinType || "Other"
    if (!acc[skinType]) {
      acc[skinType] = []
    }
    acc[skinType].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (selectedProductIDs.includes(product.productID)) {
      // Remove product if already selected
      setSelectedProductIDs(selectedProductIDs.filter(id => id !== product.productID))
      setSelectedProducts(selectedProducts.filter(p => p.productID !== product.productID))
    } else {
      // Add product if not selected
      setSelectedProductIDs([...selectedProductIDs, product.productID])
      setSelectedProducts([...selectedProducts, product])
    }
  }

  // Apply selected products to formData
  const handleApplySelection = () => {
    setFormData({ ...formData, productIDs: selectedProductIDs }) // Changed from productID to productIDs
    setIsDialogOpen(false)
  }

  // Remove a selected product
  const handleRemoveProduct = (productID: string) => {
    setSelectedProductIDs(selectedProductIDs.filter(id => id !== productID))
    setSelectedProducts(selectedProducts.filter(p => p.productID !== productID))
    setFormData({
      ...formData,
      productIDs: formData.productIDs.filter(id => id !== productID) // Changed from productID to productIDs
    })
  }

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(p => 
        p.productName.includes(searchTerm) ||
        p.productID.includes(searchTerm) ||
        (p.category && p.category.includes(searchTerm))
      )
    : products

  // Reorganize filtered products by skin type
  const filteredGroupedProducts = filteredProducts.reduce((acc, product) => {
    const skinType = product.skinType || "Other"
    if (!acc[skinType]) {
      acc[skinType] = []
    }
    acc[skinType].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.productIDs.length === 0) { // Changed from productID to productIDs
      toast({
        title: "Error",
        description: "Please select at least one product for this promotion.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      await createPromotion(formData)
      toast({
        title: "Success",
        description: "Promotion created successfully!"
      })
      router.push("/manager/promotions")
    } catch (error) {
      console.error("Failed to create promotion:", error)
      toast({
        title: "Error",
        description: "Failed to create promotion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium">Promotion Name</label>
              <Input
                value={formData.promotionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, promotionName: e.target.value })}
                placeholder="Enter promotion name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Discount (%)</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, discount: Number(e.target.value) })}
                placeholder="Enter discount percentage"
                required
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endDate: e.target.value })}
                required
                min={formData.startDate}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Products</label>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" type="button" className="w-full justify-start text-left font-normal">
                    {selectedProducts.length > 0 
                      ? `${selectedProducts.length} products selected` 
                      : "Select products"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Products</DialogTitle>
                  </DialogHeader>
                  
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Search products by name, ID or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-4">
                    {Object.keys(filteredGroupedProducts).length === 0 ? (
                      <p className="text-center text-gray-500 my-8">No products found</p>
                    ) : (
                      Object.entries(filteredGroupedProducts).map(([skinType, products]) => (
                        <div key={skinType} className="mb-6">
                          <h3 className="font-semibold text-lg mb-2 border-b pb-1">{skinType}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {products.map(product => (
                              <div 
                                key={product.productID}
                                className={`p-3 border rounded-md cursor-pointer flex items-center gap-3 ${
                                  selectedProductIDs.includes(product.productID) ? 'bg-primary/5 border-primary' : ''
                                }`}
                                onClick={() => handleProductSelect(product)}
                              >
                                <Checkbox 
                                  checked={selectedProductIDs.includes(product.productID)}
                                  className="pointer-events-none"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{product.productName}</p>
                                  <p className="text-sm text-gray-500">ID: {product.productID}</p>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{product.category || "N/A"}</span>
                                    <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {selectedProductIDs.length} products selected
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApplySelection}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Display selected products */}
              {selectedProducts.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedProducts.map(product => (
                    <div 
                      key={product.productID} 
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-xs text-gray-500">ID: {product.productID}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.productID)}
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => router.back()} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}