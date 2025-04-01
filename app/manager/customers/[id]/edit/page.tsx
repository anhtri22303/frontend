"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchUserById, updateUser } from "@/app/api/userManagerApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skinType: string;
  loyalPoints: number;
}

export default function EditCustomerPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    skinType: "",
    loyalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid customer ID.");
      setIsLoading(false);
      return;
    }

    const loadCustomer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await fetchUserById(id as string);
        console.log("Fetched customer data:", userData);
        if (userData) {
          // Kiểm tra xem user có phải là customer không
          if (userData.role !== "CUSTOMER") {
            setError("This user is not a customer.");
            return;
          }
          setFormData({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            skinType: userData.skinType || "",
            loyalPoints: userData.loyalPoints || 0,
          });
        } else {
          setError("Customer not found.");
        }
      } catch (error) {
        console.error("Failed to load customer:", error);
        setError("Failed to load customer details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.fullName.trim() || !formData.email.trim()) {
        toast.error("Full Name and Email are required.");
        setIsSubmitting(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }

      // Ánh xạ skinType: nếu là "NONE" thì gửi về backend dưới dạng chuỗi rỗng
      const updatedFormData = {
        ...formData,
        skinType: formData.skinType === "NONE" ? "" : formData.skinType,
        role: "CUSTOMER", // Đảm bảo role luôn là CUSTOMER
      };

      await updateUser(id as string, updatedFormData);
      toast.success("Customer updated successfully!");
      router.push("/manager/customers"); // Điều hướng về danh sách khách hàng
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer. Please try again.");
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

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500 py-12">
        <p className="text-lg">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/manager/customers")}
          className="mt-4 transition-all duration-200"
        >
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/manager/customers")}
          className="mr-4 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Customer</h1>
      </div>

      <Card className="bg-white shadow-lg border border-gray-200 rounded-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Edit Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                  className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  required
                  className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skin Type</label>
                <Select
                  value={formData.skinType}
                  onValueChange={(value) => setFormData({ ...formData, skinType: value })}
                >
                  <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200">
                    <SelectValue placeholder="Select skin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="DRY">Dry</SelectItem>
                    <SelectItem value="OILY">Oily</SelectItem>
                    <SelectItem value="COMBINATION">Combination</SelectItem>
                    <SelectItem value="SENSITIVE">Sensitive</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Loyal Points</label>
                <Input
                  type="number"
                  value={formData.loyalPoints}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, loyalPoints: Number(e.target.value) })
                  }
                  placeholder="Enter loyal points"
                  min="0"
                  className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => router.push("/manager/customers")}
                disabled={isSubmitting}
                className="transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Customer"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}