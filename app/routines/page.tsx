"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { addToCart } from "@/app/api/cartApi";
import { fetchCustomerByID } from "@/app/api/customerApi";

interface Product {
  id: string;
  productID: string;
  productName: string;
  description: string;
  price: number;
  category?: string;
  rating?: number;
  image_url: string;
  status?: string;
}

interface SkinCareRoutine {
  id: string;
  routineID: string;
  skinType: string;
  routineName: string;
  routineDescription: string;
  status: string;
  products: Product[];
}

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skinType: string;
  avatar_url: string;
  skinCareRoutine: SkinCareRoutine;
}

export default function RoutineDetailPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const categoryOrder = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Mask"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = localStorage.getItem("userID");
        if (!userID) {
          toast.error("User not logged in!");
          router.push("/login");
          return;
        }

        const userData = await fetchCustomerByID(userID);
        if (!userData) {
          toast.error("Failed to fetch user data");
          return;
        }
        
        setUserData(userData);
        console.log("Fetched user data:", userData);
        
        if (!userData.skinCareRoutine) {
          toast.info("Please complete the skin quiz first to get personalized routines");
          router.push("/skin-quiz");
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading your skin care routine");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your personalized routine...</div>
      </div>
    );
  }

  if (!userData || !userData.skinCareRoutine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No skin care routine found. Please complete the skin quiz.</div>
        <div className="mt-4 text-center">
          <Button onClick={() => router.push("/skin-quiz")}>Take Skin Quiz</Button>
        </div>
      </div>
    );
  }

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

  const routine = userData.skinCareRoutine;

  const groupedProducts = routine.products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as { [key: string]: Product[] });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Skin Info */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Your Skin Profile</h2>
        <p className="text-muted-foreground">Skin Type: <span className="font-medium text-primary">{userData.skinType}</span></p>
      </div>

      {/* Routine Details */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">{routine.routineName}</h1>
        <p className="text-center text-muted-foreground">{routine.routineDescription}</p>
        <p className="text-center text-green-600 mt-2">✓ This routine is customized for your {userData.skinType} skin</p>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products in Your Routine</h2>
        {Object.keys(groupedProducts)
          .sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
          })
          .map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-bold mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedProducts[category].map((product) => (
                  <Card key={product.productID} className="overflow-hidden group">
                    <Link href={`/shop/product/${product.productID}`}>
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
                                  i < (product.rating || 0)
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
                    </Link>
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
            </div>
          ))}
      </div>
    </div>
  );
}