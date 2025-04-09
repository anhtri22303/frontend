"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRoutine } from "@/app/api/routineApi";
import { fetchProductsBySkinType } from "@/app/api/productApi";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateRoutinePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    skinType: "",
    routineName: "",
    routineDescription: "",
  });
  const [productIDs, setProductIDs] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (formData.skinType) {
        try {
          const response = await fetchProductsBySkinType(formData.skinType);
          setAllProducts(response || []);
        } catch (error) {
          console.error("Error fetching products by skin type:", error);
          setAllProducts([]);
        }
      } else {
        setAllProducts([]);
      }
    };

    fetchFilteredProducts();
  }, [formData.skinType]);

  const filteredProducts = searchTerm
    ? allProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : allProducts;

  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];
  const filteredCategories = categories.filter((category) =>
    filteredProducts.some((product) => product.category === category)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestBody = {
        ...formData,
        productIDs: productIDs,
      };
      await createRoutine(requestBody);
      router.push("/staff/routines");
    } catch (error) {
      console.error("Failed to create routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductSelection = (productID: string) => {
    setProductIDs((prev) =>
      prev.includes(productID)
        ? prev.filter((id) => id !== productID)
        : [...prev, productID]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Routine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Skin type</label>
              <Select
                value={formData.skinType}
                onValueChange={(value) =>
                  setFormData({ ...formData, skinType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dry">Dry</SelectItem>
                  <SelectItem value="Oily">Oily</SelectItem>
                  <SelectItem value="Combination">Combination</SelectItem>
                  <SelectItem value="Sensitive">Sensitive</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Routine Name</label>
              <Input
                value={formData.routineName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, routineName: e.target.value })
                }
                placeholder="Enter routine name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <Textarea
                value={formData.routineDescription}
                onChange={(e) =>
                  setFormData({ ...formData, routineDescription: e.target.value })
                }
                placeholder="Enter routine description"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">List Product</label>
              <Dialog open={isProductListOpen} onOpenChange={setIsProductListOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-start text-left font-normal"
                  >
                    {productIDs.length > 0
                      ? `${productIDs.length} products selected`
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
                    {filteredCategories.map((category) => {
                      const categoryProducts = filteredProducts.filter(
                        (product) => product.category === category
                      );
                      if (categoryProducts.length === 0) return null;

                      return (
                        <div key={category} className="mb-6">
                          <h3 className="font-semibold text-lg mb-2 border-b pb-1">
                            {category}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryProducts.map((product) => (
                              <div
                                key={product.productID}
                                className={`p-3 border rounded-md cursor-pointer flex items-center gap-3 ${
                                  productIDs.includes(product.productID)
                                    ? "bg-primary/5 border-primary"
                                    : ""
                                }`}
                                onClick={() => toggleProductSelection(product.productID)}
                              >
                                <Checkbox
                                  checked={productIDs.includes(product.productID)}
                                  className="pointer-events-none"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{product.productName}</p>
                                  <p className="text-sm text-gray-500">
                                    ID: {product.productID}
                                  </p>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                      {product.category || "N/A"}
                                    </span>
                                    {product.price && (
                                      <span className="text-sm font-medium">
                                        ${product.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <p className="text-center text-gray-500 my-8">
                        No products found for this skin type or search term
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {productIDs.length} products selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsProductListOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setIsProductListOpen(false)}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {productIDs.length > 0 && (
                <div className="mt-2 space-y-2">
                  {allProducts
                    .filter((product) => productIDs.includes(product.productID))
                    .map((product) => (
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
                          onClick={() => toggleProductSelection(product.productID)}
                          type="button"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Routine"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}