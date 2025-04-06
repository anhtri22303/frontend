"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchRoutinesBySkinType } from "@/app/api/routineApi";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/api/cartApi";
import toast from "react-hot-toast";
import Link from "next/link";
import { fetchCustomerByID, updateCustomer } from "@/app/api/customerApi";
import { applyRoutineToUser } from "@/app/api/routineApi";

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

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skinType: string;
  loyalPoints: number;
}

export default function QuizResults() {
  const searchParams = useSearchParams();
  const skinType = searchParams.get("skinType");
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateCustomer = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          toast.error("User not logged in!");
          return;
        }

        // Fetch customer data
        const customerData = await fetchCustomerByID(userId);
        if (!customerData) {
          console.error("Customer data is missing or invalid.");
          return;
        }

        // Gán userId vào customer.id nếu thiếu
        const updatedCustomerData = { ...customerData, id: userId };
        setCustomer(updatedCustomerData);
        console.log("Fetched customer data:", updatedCustomerData);

        // Update skin type if needed
        if (skinType && updatedCustomerData.skinType !== skinType) {
          const formData = new FormData();
          const { id, ...updatedCustomer } = updatedCustomerData; // Loại bỏ trường `id`
          updatedCustomer.skinType = skinType; // Cập nhật skinType

          formData.append("user", JSON.stringify(updatedCustomer));

          const response = await updateCustomer(userId, formData);
          if (response) {
            setCustomer(response); // Cập nhật state với dữ liệu mới
            console.log("Customer updated skinType successfully:", response);
            toast.success("Skin type updated successfully!");
          } else {
            toast.error("Failed to update customer.");
          }
        }
      } catch (error) {
        console.error("Error fetching or updating customer data:", error);
        toast.error("Failed to fetch or update customer data.");
      }
    };

    fetchAndUpdateCustomer();
  }, [skinType]);


  // Fetch routines and products
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Your Skin Type */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Your Skin Type: {skinType}</h2>
      </div>

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
                  <Link href={`/skin-quiz/results/${routine.routineID}`}>
                    <Button className="mt-4">View Detail</Button>
                  </Link>
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
    </div>
  );
}