"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRoutine } from "@/app/api/routineApi";
import { fetchProducts } from "@/app/api/productApi";
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
import { X } from "lucide-react";

interface Product {
  productID: string;
  productName: string;
  description: string;
  price: number;
  skinType: string;
  category: string;
  rating: number;
  image_url: string | null;
}

export default function CreateRoutinePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    skinType: "Dry",
    routineName: "",
    routineDescription: "",
    productIds: [] as string[],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await fetchProducts();
        console.log("Fetched products:", data);
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    if (selectedProduct && !selectedProductIds.includes(selectedProduct)) {
      setSelectedProductIds([...selectedProductIds, selectedProduct]);
      setSelectedProduct("");
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedFormData = {
        ...formData,
        productIds: selectedProductIds,
      };
      await createRoutine(updatedFormData);
      router.push("/manager/routines");
    } catch (error) {
      console.error("Failed to create routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = (productId: string) => {
    return products.find((product) => product.productID === productId);
  };

  console.log("Rendering Select Products:", { products, isLoadingProducts });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Routine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Skin Type</label>
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
              <label>Routine Name</label>
              <Input
                value={formData.routineName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, routineName: e.target.value })
                }
                placeholder="Enter routine name"
              />
            </div>

            <div className="space-y-2">
              <label>Description</label>
              <Textarea
                value={formData.routineDescription}
                onChange={(e) =>
                  setFormData({ ...formData, routineDescription: e.target.value })
                }
                placeholder="Enter routine description"
              />
            </div>

            <div className="space-y-2">
              <label>Select Products</label>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedProduct}
                  onValueChange={(value) => setSelectedProduct(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProducts ? (
                      <div className="text-muted-foreground p-2">
                        Loading products...
                      </div>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem
                          key={product.productID}
                          value={product.productID}
                        >
                          {product.productName} (ID: {product.productID})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-muted-foreground p-2">
                        No products available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!selectedProduct}
                  className="px-3 py-2"
                >
                  +
                </Button>
              </div>

              {selectedProductIds.length > 0 && (
                <div className="mt-2">
                  <label className="text-sm font-medium">Selected Products:</label>
                  <div className="border rounded-md p-2 mt-1">
                    {selectedProductIds.map((productId) => {
                      const product = getProductById(productId);
                      return (
                        <div
                          key={productId}
                          className="flex items-center justify-between py-1"
                        >
                          <span>
                            {product
                              ? `${product.productName} (ID: ${product.productID})`
                              : `Product ID: ${productId}`}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
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