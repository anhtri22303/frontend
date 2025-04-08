"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRoutineById } from "@/app/api/routineApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Product {
  productID: string;
  productName: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  rating?: number;
}

interface Routine {
  routineID: string;
  routineName: string;
  routineDescription: string;
  productDTOS?: Product[];
}

export default function RoutineDetailPage() {
  const { routineID } = useParams();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const categoryOrder = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Mask"];

  useEffect(() => {
    const fetchRoutineData = async () => {
      try {
        if (!routineID) return;

        const routineData = await fetchRoutineById(routineID);
        setRoutine(routineData.data);
        console.log("Fetched routine data:", routineData);
      } catch (error) {
        console.error("Error fetching routine data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutineData();
  }, [routineID]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading routine details...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Routine not found.</div>
      </div>
    );
  }

  const groupedProducts = routine.productDTOS?.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as { [key: string]: Product[] }) || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/manager/routines")}
      >
        <ArrowLeft size={16} />
        Back to Routines
      </Button>
      
      {/* Routine Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{routine.routineName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{routine.routineDescription}</p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => router.push(`/manager/routines/${routineID}/edit`)}
            >
              Edit Routine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Products in this Routine</h2>
        {Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts)
            .sort((a, b) => {
              const indexA = categoryOrder.indexOf(a);
              const indexB = categoryOrder.indexOf(b);
              return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
            })
            .map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-bold mb-4 border-b pb-2">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupedProducts[category].map((product) => (
                    <Card key={product.productID} className="overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.productName}
                          className="object-cover w-full h-full"
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
                        <Button 
                          variant="link" 
                          className="px-0 mt-2"
                          onClick={() => router.push(`/manager/products/${product.productID}`)}
                        >
                          View Product Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products associated with this routine.</p>
          </div>
        )}
      </div>
    </div>
  );
}