"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  username: string
  image?: string
  skinType?: string
  loyaltyPoints: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signUp: (data: { username: string, password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  signUp: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => { // Thay email bằng username
    setIsLoading(true)
    try {
      // This would be an API call in a real application
      // Simulating a successful login for demo purposes
      const mockUser: User = {
        id: "user-1",
        username, // Thay email bằng username
        loyaltyPoints: 150,
        skinType: "combination",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/")
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
      // This would be an API call to your Google OAuth endpoint in a real application
      // Simulating a successful login for demo purposes
      const mockUser: User = {
        id: "google-user-1",
        username: "googleuser", // Thay email và name bằng username
        image: "/placeholder.svg?height=40&width=40",
        loyaltyPoints: 75,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/")
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: { username: string, password: string }) => { // Thay email và fullname bằng username
    setIsLoading(true)
    try {
      // This would be an API call in a real application
      // Simulating a successful sign-up for demo purposes
      const mockUser: User = {
        id: "user-2",
        username: data.username, // Thay email và fullname bằng username
        loyaltyPoints: 0,
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

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}