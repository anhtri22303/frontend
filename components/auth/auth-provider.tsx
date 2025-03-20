"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { login as loginApi, loginWithGoogle as loginWithGoogleApi } from "@/app/api/authApi"

// Update User type
type User = {
  id: string
  username: string
  fullName: string | null
  image?: string
  role: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signUp: (data: { username: string; password: string }) => Promise<void>
  logout: () => void
}

// Create and export the context
const AuthContext = createContext<AuthContextType>({
  user: null,
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
        id: localStorage.getItem("userID") || "",  // Changed from userId to userID
        username: localStorage.getItem("userEmail") || "",
        fullName: localStorage.getItem("userName"),
        role: localStorage.getItem("userRole") || "",
        email: localStorage.getItem("userEmail") || "",
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
        const userData = response.data
        setUser(userData)
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
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    document.cookie = "jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
  }

  const signUp = async (data: { username: string; password: string }) => {
    setIsLoading(true)
    try {
      const mockUser: User = {
        id: "user-2",
        username: data.username,
        fullName: data.username,
        role: "CUSTOMER"
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/")
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}