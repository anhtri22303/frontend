"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPromotion } from "@/app/api/promotionApi"; // Adjust the import path

export default function CreatePromotionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    promotionName: "",
    productIDs: [],
    discount: "",
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
      console.error("Failed to create promotion:", error);
      setError("Failed to create promotion. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Promotion</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Promotion Name</label>
          <input
            type="text"
            name="promotionName"
            value={formData.promotionName}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            min="0"
            max="100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Products</label>
          {availableProducts.map((product) => (
            <div key={product.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.productIDs.includes(product.id)}
                onChange={() => handleProductSelect(product.id)}
                className="mr-2"
              />
              <span>
                {product.name} (ID: {product.id})
              </span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-1">
            {formData.productIDs.length} product(s) selected
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="border p-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded"
          >
            Create Promotion
          </button>
        </div>
      </form>
    </div>
  );
}