"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRoutineById, updateRoutine } from "@/app/api/routineApi";
import { fetchProductsBySkinType } from "@/app/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  productID: string;
  productName: string;
  category: string;
}

interface Routine {
  routineID: string;
  skinType: string;
  routineName: string;
  routineDescription: string;
  productIDs?: string[]; // Changed from products to productIDs for consistency
}

interface RoutineEditPageProps {
  params: {
    routineID: string;
  };
}

export default function RoutineEditPage({ params }: RoutineEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine>({
    routineID: "",
    skinType: "",
    routineName: "",
    routineDescription: "",
    productIDs: [],
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skinTypes = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];
  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];

  // Load routine details
  useEffect(() => {
    const loadRoutine = async () => {
      if (!params.routineID) {
        setError("Routine ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchRoutineById(params.routineID);
        if (!response.data) {
          setError("Routine not found.");
          return;
        }

        // Assuming the API returns productIDs instead of full product objects
        setRoutine({
          ...response.data,
          productIDs: response.data.productIDs || response.data.products?.map((p: Product) => p.productID) || [],
        });
      } catch (err) {
        console.error("Failed to fetch routine:", err);
        setError("Failed to load routine details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutine();
  }, [params.routineID]);

  // Fetch products when skinType changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (routine.skinType) {
        try {
          const response = await fetchProductsBySkinType(routine.skinType);
          setAllProducts(response);
        } catch (error) {
          console.error("Error fetching products by skin type:", error);
          setAllProducts([]);
        }
      } else {
        setAllProducts([]);
      }
    };

    fetchFilteredProducts();
  }, [routine.skinType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoutine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkinTypeChange = (value: string) => {
    setRoutine((prev) => ({
      ...prev,
      skinType: value,
      productIDs: [], // Reset product selection when skin type changes
    }));
  };

  const toggleProductSelection = (productID: string) => {
    setRoutine((prev) => ({
      ...prev,
      productIDs: prev.productIDs?.includes(productID)
        ? prev.productIDs.filter((id) => id !== productID)
        : [...(prev.productIDs || []), productID],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!routine.routineName.trim()) {
      setError("Routine name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!routine.skinType) {
      setError("Skin type is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData = {
        routineID: routine.routineID,
        routineName: routine.routineName,
        routineDescription: routine.routineDescription,
        skinType: routine.skinType,
        productIDs: routine.productIDs,
      };

      await updateRoutine(params.routineID, updatedData);

      toast({
        title: "Success",
        description: "Routine updated successfully!",
        variant: "default",
      });

      router.push(`/manager/routines/${params.routineID}`);
    } catch (err) {
      console.error("Failed to update routine:", err);
      setError("Failed to update routine. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update routine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !routine.routineID) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500 py-12">
        <p className="text-lg">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/manager/routines")}
          className="mt-4 transition-all duration-200"
        >
          Back to Routines
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/manager/routines")}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Routine</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Routine Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineID">
                Routine ID
              </label>
              <Input
                id="routineID"
                name="routineID"
                value={routine.routineID}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineName">
                Routine Name *
              </label>
              <Input
                id="routineName"
                name="routineName"
                value={routine.routineName}
                onChange={handleInputChange}
                placeholder="Enter routine name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="skinType">
                Skin Type *
              </label>
              <Select value={routine.skinType} onValueChange={handleSkinTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineDescription">
                Description
              </label>
              <Textarea
                id="routineDescription"
                name="routineDescription"
                value={routine.routineDescription}
                onChange={handleInputChange}
                placeholder="Enter routine description"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">List Product</label>
              <div className="border p-4 rounded-md">
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.productIDs?.map((productID) => (
                    <span key={productID} className="px-2 py-1 bg-primary text-white rounded-md text-sm">
                      {productID}
                    </span>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductListOpen((prev) => !prev)}
                >
                  {isProductListOpen ? "Close List" : "Select Products"}
                </Button>

                {isProductListOpen && (
                  <div className="mt-4">
                    {categories.map((category) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">{category}</h3>
                        <div className="max-h-64 overflow-y-auto border-t pt-4">
                          {allProducts
                            .filter((product) => product.category === category)
                            .map((product) => (
                              <div
                                key={product.productID}
                                className="flex items-center justify-between py-2"
                              >
                                <span>
                                  {product.productName} ({product.productID})
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    routine.productIDs?.includes(product.productID)
                                      ? "secondary"
                                      : "outline"
                                  }
                                  onClick={() => toggleProductSelection(product.productID)}
                                >
                                  {routine.productIDs?.includes(product.productID)
                                    ? "Selected"
                                    : "Select"}
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/manager/routines/${params.routineID}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}