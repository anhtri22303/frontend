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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  skinType: string;
  loyalPoints: number;
  role: string;
  avatar_url?: string; // Thêm trường avatar_url
}

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    skinType: "",
    loyalPoints: 0,
    role: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // State cho file ảnh
  const [avatarPreview, setAvatarPreview] = useState<string>(""); // State cho preview
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid user ID.");
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await fetchUserById(id as string);
        console.log("Fetched user data:", userData);
        if (userData) {
          setFormData({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            skinType: userData.skinType || "",
            loyalPoints: userData.loyalPoints || 0,
            role: userData.role || "",
            avatar_url: userData.avatar_url || "",
          });
          setAvatarPreview(userData.avatar_url || ""); // Khởi tạo preview từ avatar_url
        } else {
          setError("User not found.");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Basic validation
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

      const formDataToSend = new FormData();
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        skinType: formData.skinType,
        loyalPoints: formData.loyalPoints,
        role: formData.role,
      };
      formDataToSend.append("user", JSON.stringify(userData));
      if (avatarFile) {
        formDataToSend.append("image", avatarFile);
      }

      console.log("1 - FormData entries:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await updateUser(id as string, formDataToSend);
      console.log("2", response);
      if (response) {
        toast.success("User updated successfully!");
        router.push("/manager/users");
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user. Please try again.");
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
          onClick={() => router.push("/manager/users")}
          className="mt-4 transition-all duration-200"
        >
          Back to Users
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
          onClick={() => router.push("/manager/users")}
          className="mr-4 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={avatarPreview || "/placeholder.svg?height=128&width=128"}
                alt={formData.fullName}
              />
              <AvatarFallback>{formData.fullName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="mt-4 flex flex-col items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatarUpload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md text-sm"
              >
                Choose File
              </label>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-white shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Edit User Details
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
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Oily">Oily</SelectItem>
                      <SelectItem value="Combination">Combination</SelectItem>
                      <SelectItem value="Sensitive">Sensitive</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push("/manager/users")}
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
                    "Update User"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}