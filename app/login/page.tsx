"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { login, loginWithGoogle } from "@/app/api/authApi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoading } = useAuth();
  const router = useRouter();

  const saveUserData = (userData: any) => {
    localStorage.setItem("jwtToken", userData.jwtToken);
    document.cookie = `jwtToken=${userData.jwtToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
    localStorage.setItem("userID", userData.userID);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("fullName", userData.fullName || "");
    localStorage.setItem("userAddress", userData.address || "");
    localStorage.setItem("userPhone", userData.phone || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({
        username,
        password,
      });

      if (response.data) {
        console.log("Login response data:", response.data);
        saveUserData(response.data.data);
        handleRedirect(response.data.data.role);

        // Hiển thị thông báo thành công
        toast.success("Login successful!");
      }
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);

      // Hiển thị thông báo lỗi
      toast.error("Invalid username or password");
    }
  };

  const handleRedirect = (role: string) => {
    switch (role) {
      case "MANAGER":
        router.push("/manager");
        break;
      case "STAFF":
        router.push("/staff");
        break;
      case "CUSTOMER":
        router.push("/");
        break;
      default:
        router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await loginWithGoogle();
      if (response?.data) {
        saveUserData(response.data);

        // Hiển thị thông báo thành công
        toast.success("Google login successful!");

        // Điều hướng dựa trên role
        switch (response.data.role) {
          case "MANAGER":
            router.push("/manager");
            break;
          case "STAFF":
            router.push("/staff");
            break;
          case "CUSTOMER":
          default:
            router.push("/");
        }
      }
    } catch (err) {
      setError("Google login failed");
      console.error("Google login error:", err);

      // Hiển thị thông báo lỗi
      toast.error("Google login failed");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to GlowCorner</CardTitle>
          <CardDescription className="text-center">
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}