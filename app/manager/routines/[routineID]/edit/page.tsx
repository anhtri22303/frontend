"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchRoutineById, updateRoutine } from "@/app/api/routineApi";
import { fetchProducts } from "@/app/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EditRoutinePage() {
  const router = useRouter();
  const { routineID } = useParams(); // Lấy routineID từ URL
  const [formData, setFormData] = useState({
    skinType: "",
    routineName: "",
    routineDescription: "",
  });
  const [products, setProducts] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch routine data by ID
  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        const routine = await fetchRoutineById(routineID);
        setFormData({
          skinType: routine.skinType,
          routineName: routine.routineName,
          routineDescription: routine.routineDescription,
        });
        setProducts(routine.products || []); // Nếu routine có danh sách sản phẩm
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await fetchProducts();
        setAllProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchRoutineData();
    fetchAllProducts();
  }, [routineID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");
    setIsLoading(true);
    try {
      const requestBody = {
        ...formData,
        products,
      };
      console.log("Request Body:", requestBody);
      await updateRoutine(routineID, requestBody);
      router.push("/manager/routines");
    } catch (error) {
      console.error("Failed to update routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductSelection = (productID: string) => {
    setProducts((prev) =>
      prev.includes(productID) ? prev.filter((id) => id !== productID) : [...prev, productID]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Routine</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label>Skin type</label>
              <Select
                value={formData.skinType}
                onValueChange={(value) => setFormData({ ...formData, skinType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dry">Dry</SelectItem>
                  <SelectItem value="Oily">Oily</SelectItem>
                  <SelectItem value="Combination">Combination</SelectItem>
                  <SelectItem value="Sensitive">Sensitive</SelectItem>
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
              <label>List Product</label>
              <div className="border p-4 rounded-md mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {products.map((productID) => (
                    <span key={productID} className="px-2 py-1 bg-primary text-white rounded-md text-sm">
                      {productID}
                    </span>
                  ))}
                </div>

                <Button type="button" variant="outline" onClick={() => setIsProductListOpen((prev) => !prev)}>
                  {isProductListOpen ? "Close List" : "Select Products"}
                </Button>

                {isProductListOpen && (
                  <div className="mt-4 max-h-64 overflow-y-auto border-t pt-4">
                    {allProducts.map((product) => (
                      <div key={product.productID} className="flex items-center justify-between py-2">
                        <span>
                          {product.productName} ({product.productID})
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant={products.includes(product.productID) ? "secondary" : "outline"}
                          onClick={() => toggleProductSelection(product.productID)}
                        >
                          {products.includes(product.productID) ? "Selected" : "Select"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Routine"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}