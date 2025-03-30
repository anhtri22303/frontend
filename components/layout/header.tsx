"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Route {
  href: string
  label: string
}

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    setUserRole(role)

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
      const newRole = localStorage.getItem("userRole")
      setUserRole(newRole)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    // Gọi hàm logout từ useAuth
    logout()

    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken") // Nếu bạn lưu token ở đây

    // Chuyển hướng về trang login và reload trang
    window.location.href = "/login"
  }

  const getRoutes = (): Route[] => {
    if (userRole === "MANAGER") {
      return []  // Manager không có menu items
    }
    if (userRole === "STAFF") {
      return []  // Staff không có menu items
    }
    // Customer hoặc chưa login
    return [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/skin-quiz", label: "Skin Quiz" },
      { href: "/routines", label: "Routines" },
      { href: "/about", label: "About" },
    ]
  }

  const getLogoLink = () => {
    if (userRole === "MANAGER") return "/manager"
    if (userRole === "STAFF") return "/staff"
    return "/"
  }

  const routes = getRoutes()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href={getLogoLink()} className="flex items-center gap-2 ml-2">
            <span className="font-extrabold text-2xl md:text-3xl lg:text-4xl">Glow Corner</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {(!userRole || userRole === "CUSTOMER") && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.image || ""} alt={user.fullName || ""} />
                    <AvatarFallback className="text-lg">{(() => {
                      switch (user.role) {
                        case "MANAGER":
                          return "M"
                        case "STAFF":
                          return "S"
                        case "CUSTOMER":
                          return "C"
                        case "BEAUTY_ADVISOR":
                          return "B"
                        default:
                          return "U"
                      }
                    })()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
                <User className="h-6 w-6" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}