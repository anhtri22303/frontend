"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchRoutineById } from "@/app/api/routineApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react"; // Sử dụng icon từ lucide-react

interface Product {
  productID: string;
  productName: string;
}

interface Routine {
  routineID: string;
  skinType: string;
  routineName: string;
  routineDescription: string;
  products?: Product[]; // Danh sách sản phẩm (nếu có)
}

export default function RoutineDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadRoutine = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRoutineById(id as string);
        setRoutine(data);
      } catch (err) {
        console.error("Failed to fetch routine:", err);
        setError("Failed to load routine details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutine();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500 py-12">
        <p className="text-lg">{error || "Routine not found."}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/staff/routines")}
          className="mt-4 transition-all duration-200"
        >
          Back to Routines
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/staff/routines")}
          className="mr-4 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{routine.routineName}</h1>
      </div>

      {/* Routine Details */}
      <Card className="bg-white shadow-lg border border-gray-200 rounded-lg mb-6">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Routine Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Routine Name</p>
              <p className="text-gray-900">{routine.routineName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Skin Type</p>
              <p className="text-primary">{routine.skinType}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Description</p>
            <p className="text-gray-900">{routine.routineDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* Products List (nếu có) */}
      {routine.products && routine.products.length > 0 ? (
        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Products in Routine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {routine.products.map((product) => (
                <div
                  key={product.productID}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">{product.productName}</p>
                    <p className="text-xs text-gray-500">ID: {product.productID}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/staff/products/${product.productID}`)} // Giả sử bạn có route cho product detail
                    className="transition-all duration-200"
                  >
                    View Product
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500 py-6">
          <p className="text-sm">No products associated with this routine.</p>
        </div>
      )}
    </div>
  );
}