"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { login as loginApi, loginWithGoogle as loginWithGoogleApi, signUp as signUpApi } from "@/app/api/authApi"

type User = {
  userID: string
  username: string
  fullName: string | null
  image?: string
  role: string
  email: string
  phone?: string
  address?: string
  skinType?: string
  loyalPoints?: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signUp: (data: { username: string; password: string }) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void  // Add this line
}

// Create and export the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  updateUser: () => {},
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signUp: async () => {},
  logout: () => {},
})

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken")
    if (jwtToken) {
      const userData = {
        userID: localStorage.getItem("userID") || "",
        username: localStorage.getItem("userEmail") || "",
        fullName: localStorage.getItem("userName"),
        role: localStorage.getItem("userRole") || "",
        email: localStorage.getItem("userEmail") || "",
        phone: localStorage.getItem("userPhone") || "",
        address: localStorage.getItem("userAddress") || "",
        skinType: localStorage.getItem("userSkinType") || "",
        loyalPoints: Number(localStorage.getItem("userLoyalPoints")) || 0
      }
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await loginApi({ email, password })
      if (response.data) {
        const userData = response.data.data  // Access the nested data object
        setUser({
          userID: userData.userID,
          username: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          skinType: userData.skinType,
          loyalPoints: userData.loyalPoints
        })
        // Save to localStorage
        localStorage.setItem("jwtToken", userData.jwtToken)
        localStorage.setItem("userID", userData.userID)
        localStorage.setItem("userRole", userData.role)
        localStorage.setItem("userEmail", userData.email)
        localStorage.setItem("userName", userData.fullName || "")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogleApi()
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("userID")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    document.cookie = "jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
    console.log("User logged out");
  }

  const signUp = async (data: { username: string; password: string }) => {
    setIsLoading(true)
    try {
      const response = await signUpApi(data)
      if (response.data) {
        const userData = response.data
        setUser(userData)
        // Save user data to localStorage
        localStorage.setItem("jwtToken", userData.jwtToken)
        localStorage.setItem("userID", userData.userID)
        localStorage.setItem("userRole", userData.role)
        localStorage.setItem("userEmail", userData.email)
        localStorage.setItem("userName", userData.fullName || "")
        router.push("/")
      }
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signUp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}