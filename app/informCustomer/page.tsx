"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchUserById } from "@/app/api/userManagerApi";
import { updateCustomer } from "@/app/api/customerApi";
import toast from "react-hot-toast";

export default function InformCustomerPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch user data by ID
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("User ID not found!");
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchUserById(userId);
        if (response) {
          setFullName(response.data.fullName || "");
          setEmail(response.data.email || "");
          setPhone(response.data.phone || "");
          setAddress(response.data.address || "");
          localStorage.setItem("userAddress", response.data.address || "");
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

  const handleSave = async () => {
    // Kiểm tra các trường không được để trống
    if (!fullName || !email || !phone || !address) {
      toast.error("All fields are required!");
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("User ID not found!");
        return;
      }

      const response = await updateCustomer(userId, {
        fullName,
        email,
        phone,
        address,
      });

      if (response) {
        toast.success("Information updated successfully!");
        // Cập nhật thông tin vào localStorage
        localStorage.setItem("userAddress", address);
        router.push("/cart"); // Điều hướng quay lại trang cart
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
    router.push("/cart"); // Điều hướng quay lại trang cart
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-4 mt-4">
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
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}