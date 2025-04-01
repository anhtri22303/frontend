"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPromotion } from "@/app/api/promotionApi";
import { fetchProducts } from "@/app/api/productApi"; // Import fetchProducts
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { useToast } from "@/components/ui/use-toast"; // Optional: For showing success/error messages

// Define the Product interface (same as in your previous code)
interface Product {
  productID: string;
  productName: string;
  category?: string;
  price?: number;
  rating?: number;
  image_url?: string;
  skinType?: string;
  description?: string;
}

export default function CreatePromotion() {
  const router = useRouter();
  const { toast } = useToast(); // Optional: For showing success/error messages
  const [formData, setFormData] = useState({
    promotionName: "",
    discount: 0,
    startDate: "",
    endDate: "",
    productID: "", // This will store the selected productID
  });
  const [products, setProducts] = useState<Product[]>([]); // State to store the list of products
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null); // State to handle fetch errors

  // Fetch products when the component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsResponse = await fetchProducts();
        console.log("Fetch Products Response:", productsResponse);
        setProducts(productsResponse);
      } catch (error: any) {
        console.error("Failed to fetch products:", error);
        setFetchError("Failed to load products. Please try again.");
      }
    };

    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createPromotion(formData);
      toast({
        title: "Success",
        description: "Promotion created successfully.",
        duration: 3000,
      });
      router.push("/manager/promotions");
    } catch (error: any) {
      console.error("Failed to create promotion:", error);
      toast({
        title: "Error",
        description: "Failed to create promotion. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="mb-4 text-red-600">
              {fetchError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Promotion Name</label>
              <Input
                value={formData.promotionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, promotionName: e.target.value })
                }
                placeholder="Enter promotion name"
                required
              />
            </div>

            <div className="space-y-2">
              <label>Discount (%)</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, discount: Number(e.target.value) })
                }
                placeholder="Enter discount percentage"
                required
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <label>Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label>End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label>Product</label>
              <Select
                value={formData.productID}
                onValueChange={(value) =>
                  setFormData({ ...formData, productID: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <SelectItem key={product.productID} value={product.productID}>
                        {product.productName} (ID: {product.productID})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-products" disabled>
                      No products available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || products.length === 0}>
                {isLoading ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}