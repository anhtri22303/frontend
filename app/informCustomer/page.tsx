"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateCustomer } from "@/app/api/customerApi";
import toast from "react-hot-toast";

export default function InformCustomerPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Giả lập dữ liệu người dùng từ localStorage hoặc API
  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedPhone = localStorage.getItem("userPhone") || "";
    const storedAddress = localStorage.getItem("userAddress") || "";

    setFullName(storedFullName);
    setEmail(storedEmail);
    setPhone(storedPhone);
    setAddress(storedAddress);
  }, []);

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
        // // Cập nhật localStorage nếu cần
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPhone", phone);
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