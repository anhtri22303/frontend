"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchCustomerByID } from "@/app/api/customerApi"; // Updated import
import { updateCustomer } from "@/app/api/customerApi";
import toast from "react-hot-toast";

export default function InformCustomerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Email validation regex
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone validation (simple example, adjust as needed)
  const validatePhone = (phone: string) => {
    return /^\d{10,11}$/.test(phone);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("Please login first!");
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchCustomerByID(userId);
        console.log("1", response);
        if (response) {
          setFormData({
            fullName: response.fullName || "",
            email: response.email || "",
            phone: response.phone || "",
            address: response.address || "",
          });
          localStorage.setItem("userAddress", response.address || "");
          toast.success("User data loaded successfully!");
        } else {
          toast.error("Failed to load user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("User ID not found!");
        return;
      }

      const response = await updateCustomer(userId, formData);

      if (response) {
        toast.success("Information updated successfully!");
        localStorage.setItem("userAddress", formData.address);
        router.push("/cart");
      } else {
        toast.error("Failed to update information.");
      }
    } catch (error) {
      console.error("Error updating customer information:", error);
      toast.error("An error occurred while updating information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/cart");
  };

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Customer Information</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={isLoading}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isLoading}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            disabled={isLoading}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            disabled={isLoading}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <div className="flex gap-4 mt-6">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Information"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}