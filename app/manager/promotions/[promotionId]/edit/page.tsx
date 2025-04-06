"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Promotion, updatePromotion, fetchPromotionById } from "@/app/api/promotionApi"
import { fetchProducts } from "@/app/api/productApi"

interface Product {
  productID: string;
  productName: string;
  description?: string;
  price: number;
  image_url?: string;
  skinType?: string;
  category?: string;
}

interface EditPromotionPageProps {
  params: {
    promotionId: string
  }
}

export default function EditPromotionPage({ params }: EditPromotionPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProductIDs, setSelectedProductIDs] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [promotion, setPromotion] = useState<Promotion>({
    promotionID: params.promotionId,
    promotionName: "",
    productID: [],
    discount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Fetch data in parallel for better performance
        const [productsData, promotionData] = await Promise.all([
          fetchProducts(),
          fetchPromotionById(params.promotionId)
        ]);

        // Log the results to debug
        console.log("Fetched Products:", productsData);
        console.log("Fetched Promotion:", promotionData);
        
        // If products data is available
        if (productsData) {
          setProducts(productsData);
        }
        
        // If promotion data is available
        if (promotionData) {
          // Ensure productID is always an array
          const productIDs = Array.isArray(promotionData.productID) 
            ? promotionData.productID 
            : [promotionData.productID].filter(Boolean);
            
          // Format dates to YYYY-MM-DD for input[type="date"]
          const startDate = promotionData.startDate 
            ? new Date(promotionData.startDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
            
          const endDate = promotionData.endDate
            ? new Date(promotionData.endDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
          
          // Update promotion state with fetched data
          setPromotion({
            promotionID: promotionData.promotionID,
            promotionName: promotionData.promotionName || "",
            discount: promotionData.discount || 0,
            productID: productIDs,
            startDate: startDate,
            endDate: endDate
          });
          
          // Update selected product IDs
          setSelectedProductIDs(productIDs);
          
          // Find and set selected products
          if (productsData) {
            const selectedProds = productsData.filter(p => 
              productIDs.includes(p.productID)
            );
            setSelectedProducts(selectedProds);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Could not load promotion data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [params.promotionId, toast]);

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

  // Apply selected products to promotion
  const handleApplySelection = () => {
    setPromotion({
      ...promotion,
      productID: selectedProductIDs
    })
    setIsDialogOpen(false)
  }

  // Remove a selected product
  const handleRemoveProduct = (productID: string) => {
    setSelectedProductIDs(selectedProductIDs.filter(id => id !== productID))
    setSelectedProducts(selectedProducts.filter(p => p.productID !== productID))
    setPromotion({
      ...promotion,
      productID: promotion.productID.filter(id => id !== productID)
    })
  }

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(p => 
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
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
    if (isSubmitting) return
    
    if (selectedProductIDs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product for this promotion.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Ensure promotion object has the latest selected product IDs
      const updatedPromotion = {
        ...promotion,
        productID: selectedProductIDs
      }
      
      await updatePromotion(params.promotionId, updatedPromotion)
      toast({
        title: "Success",
        description: "Promotion has been updated successfully",
        duration: 3000,
      })
      router.push("/manager/promotions")
    } catch (error) {
      console.error("Error updating promotion:", error)
      toast({
        title: "Error",
        description: "Failed to update promotion. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">Loading promotion data...</div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Promotions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Promotion</CardTitle>
          <CardDescription>
            Update promotion information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Promotion Name
              </label>
              <Input
                required
                value={promotion.promotionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromotion({ ...promotion, promotionName: e.target.value })
                }
                placeholder="Enter promotion name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Discount (%)
              </label>
              <Input
                type="number"
                required
                min={0}
                max={100}
                value={promotion.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromotion({ ...promotion, discount: parseFloat(e.target.value) })
                }
                placeholder="Enter discount percentage"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                required
                value={promotion.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromotion({ ...promotion, startDate: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                End Date
              </label>
              <Input
                type="date"
                required
                value={promotion.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromotion({ ...promotion, endDate: e.target.value })
                }
                min={promotion.startDate}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Products
              </label>
              
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
                        type="button"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}