"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { createPromotion } from "@/app/api/promotionApi";
import { fetchProducts } from "@/app/api/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  productID: string;
  productName: string;
  description?: string;
  price: number;
  image_url?: string;
  skinType?: string;
  category?: string;
}

export default function CreatePromotionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    promotionName: "",
    productIDs: [] as string[],
    discount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIDs, setSelectedProductIDs] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products. Please try again.");
      }
    };
    loadProducts();
  }, []);

  // Group products by skinType
  const groupedProducts = products.reduce((acc, product) => {
    const skinType = product.skinType || "Other";
    if (!acc[skinType]) {
      acc[skinType] = [];
    }
    acc[skinType].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(
        (p) =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.productID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category &&
            p.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products;

  const filteredGroupedProducts = filteredProducts.reduce((acc, product) => {
    const skinType = product.skinType || "Other";
    if (!acc[skinType]) {
      acc[skinType] = [];
    }
    acc[skinType].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (selectedProductIDs.includes(product.productID)) {
      setSelectedProductIDs(
        selectedProductIDs.filter((id) => id !== product.productID)
      );
      setSelectedProducts(
        selectedProducts.filter((p) => p.productID !== product.productID)
      );
    } else {
      setSelectedProductIDs([...selectedProductIDs, product.productID]);
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Apply selected products to formData
  const handleApplySelection = () => {
    setFormData({
      ...formData,
      productIDs: selectedProductIDs,
    });
    setIsDialogOpen(false);
  };

  // Remove a selected product
  const handleRemoveProduct = (productID: string) => {
    setSelectedProductIDs(selectedProductIDs.filter((id) => id !== productID));
    setSelectedProducts(
      selectedProducts.filter((p) => p.productID !== productID)
    );
    setFormData({
      ...formData,
      productIDs: formData.productIDs.filter((id) => id !== productID),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIDs.length === 0) {
      setError("Please select at least one product for this promotion.");
      return;
    }

    setIsLoading(true);
    try {
      await createPromotion({
        ...formData,
        discount: parseFloat(formData.discount),
      });
      router.push("/manager/promotions");
    } catch (error) {
      console.error("Failed to create promotion:", error);
      setError("Failed to create promotion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Promotion</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Promotion Name
          </label>
          <Input
            type="text"
            name="promotionName"
            value={formData.promotionName}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            min="0"
            max="100"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            min={formData.startDate}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Products</label>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full justify-start text-left font-normal"
              >
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mt-4">
                {Object.keys(filteredGroupedProducts).length === 0 ? (
                  <p className="text-center text-gray-500 my-8">
                    No products found
                  </p>
                ) : (
                  Object.entries(filteredGroupedProducts).map(
                    ([skinType, products]) => (
                      <div key={skinType} className="mb-6">
                        <h3 className="font-semibold text-lg mb-2 border-b pb-1">
                          {skinType}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {products.map((product) => (
                            <div
                              key={product.productID}
                              className={`p-3 border rounded-md cursor-pointer flex items-center gap-3 ${
                                selectedProductIDs.includes(product.productID)
                                  ? "bg-primary/5 border-primary"
                                  : ""
                              }`}
                              onClick={() => handleProductSelect(product)}
                            >
                              <Checkbox
                                checked={selectedProductIDs.includes(
                                  product.productID
                                )}
                                className="pointer-events-none"
                              />
                              <div className="flex-1">
                                <p className="font-medium">
                                  {product.productName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {product.productID}
                                </p>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">
                                    {product.category || "N/A"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">
                  {selectedProductIDs.length} products selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleApplySelection}>Apply</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Display selected products */}
          {selectedProducts.length > 0 && (
            <div className="mt-2 space-y-2">
              {selectedProducts.map((product) => (
                <div
                  key={product.productID}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-xs text-gray-500">
                      ID: {product.productID}
                    </p>
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

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Promotion"}
          </Button>
        </div>
      </form>
    </div>
  );
}