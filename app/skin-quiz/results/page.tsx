"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchRoutinesBySkinType } from "@/app/api/routineApi";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/api/cartApi";
import toast from "react-hot-toast";

interface Routine {
  routineID: string;
  category?: string;
  routineName: string;
  routineDescription: string;
  productDTOS?: Product[];
}

interface Product {
  productID: string;
  productName: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  rating?: number;
}

export default function QuizResults() {
  const searchParams = useSearchParams();
  const skinType = searchParams.get("skinType");
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!skinType) {
          setLoading(false);
          return;
        }

        // Fetch routines for the given skin type
        const routineResults = await fetchRoutinesBySkinType(skinType);
        setRoutines(routineResults || []);

        // Extract products from routines
        const allProducts = routineResults.flatMap((routine) => routine.productDTOS || []);
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRoutines([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [skinType]);

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value) || 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, newQuantity),
    }));
  };

  const handleAddToCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("User not logged in!");
        return;
      }

      const quantity = quantities[productId] || 1;
      await addToCart(userId, productId, quantity);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your personalized recommendations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Quiz Results</h1>

      {/* Routines Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Routines</h2>
        {routines.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {routines.map((routine) => (
              <Card key={routine.routineID}>
                <CardHeader>
                  <CardTitle>{routine.routineName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{routine.routineDescription}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No routines found for your skin type.
          </p>
        )}
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.productID} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.productName}
                    className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium truncate w-full">{product.productName}</h3>
                  <div className="mt-2">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">{product.category || "N/A"}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span>Rating: {product.rating}/5</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <label
                      htmlFor={`quantity-${product.productID}`}
                      className="text-sm"
                    >
                      Qty:
                    </label>
                    <input
                      id={`quantity-${product.productID}`}
                      type="number"
                      min="1"
                      value={quantities[product.productID] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product.productID, e.target.value)
                      }
                      className="w-16"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product.productID)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No products found for your skin type.
          </p>
        )}
      </div>
    </div>
  );
}