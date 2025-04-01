"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCustomer, fetchCustomerByID } from "@/app/api/customerApi";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [skinType, setSkinType] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userID) return;

      try {
        setIsLoading(true);
        const response = await fetchCustomerByID(user.userID);
        console.log("User data:", response);
        if (response) {
          setFullName(response.fullName || "");
          setEmail(response.email || "");
          setPhone(response.phone || "");
          setAddress(response.address || "");
          setSkinType(response.skinType || "");
          setAvatarPreview(response.avatar_url || "");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.userID]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userID) return;
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      // Gửi dữ liệu user dưới dạng chuỗi JSON trong key "user"
      const userData = {
        fullName,
        email,
        phone,
        address,
        skinType,
      };
      formData.append("user", JSON.stringify(userData));
      if (avatarFile) {
        formData.append("image", avatarFile);
      }
  
      console.log("1 - FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await updateCustomer(user.userID, formData);
      console.log("2", response.data);
      if (response?.data) {
        updateUser(response.data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error("An error occurred while updating profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <span className="mr-2">←</span> Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={avatarPreview || user.avatar_url || "/placeholder.svg?height=128&width=128"}
                alt={user.username}
              />
              <AvatarFallback>{user?.username?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="mt-4 flex flex-col items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatarUpload"
                disabled={isLoading}
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="skinType">Skin Type</Label>
                  <Select
                    value={skinType}
                    onValueChange={setSkinType}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Oily">Oily</SelectItem>
                      <SelectItem value="Combination">Combination</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Sensitive">Sensitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Loyalty Points: {user.loyalPoints}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}