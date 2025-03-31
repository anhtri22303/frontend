"use client"

import React, { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Package,
  Users,
  Menu,
  X,
  UserCheck,
  BadgeDollarSign,
  ShoppingCart,
  Command,
  ChevronRight,
  Database,
  RouteIcon,
  QuoteIcon,
  SaveIcon
} from "lucide-react"

import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
}

const managerLinks: SidebarLink[] = [
  { href: "/manager", label: "Dasboard", icon: <Database className="h-6 w-6" /> },
  { href: "/manager/users", label: "Users", icon: <Users className="h-6 w-6" /> },
  { href: "/manager/customers", label: "Customers", icon: <Users className="h-6 w-6" /> },
  { href: "/manager/orders", label: "Orders", icon: <ShoppingCart className="h-6 w-6" /> },
  { href: "/manager/products", label: "Products", icon: <Package className="h-6 w-6" /> },
  { href: "/manager/promotions", label: "Promotions", icon: <BadgeDollarSign className="h-6 w-6" /> },
  { href: "/manager/feedbacks", label: "Feedbacks", icon: <Command className="h-6 w-6" /> },
  { href: "/manager/routines", label: "Routines", icon: <RouteIcon className="h-6 w-6" /> },
  // { href: "/manager/skin-quiz", label: "Skin-Quiz", icon: <QuoteIcon className="h-6 w-6" /> },
  // { href: "/manager/answers", label: "Answers", icon: <SaveIcon className="h-6 w-6" /> },
]

const staffLinks: SidebarLink[] = [
  { href: "/staff", label: "Routines", icon: <RouteIcon className="h-6 w-6" /> },
  { href: "/staff/products", label: "Products", icon: <Package className="h-6 w-6" /> },
  { href: "/staff/orders", label: "Orders", icon: <ShoppingCart className="h-6 w-6" /> },
  { href: "/staff/promotions", label: "Promotions", icon: <BadgeDollarSign className="h-6 w-6" /> },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showFooter, setShowFooter] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const checkUserRole = () => {
      const role = localStorage.getItem("userRole")
      setUserRole(role)
      setShowFooter(!role || role === "CUSTOMER")
    }

    checkUserRole()
    window.addEventListener("storage", checkUserRole)
    
    return () => {
      window.removeEventListener("storage", checkUserRole)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const renderSidebar = () => {
    if (!userRole || userRole === "CUSTOMER") return null

    const links = userRole === "MANAGER" ? managerLinks : staffLinks

    return (
      <>
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "transition-transform duration-300"
          )}
        >
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              {userRole === "MANAGER" ? "Manager Page" : "Staff Page"}
            </h1>
          </div>
          <div className="space-y-4 py-6">
            <div className="px-6">
            </div>
            <nav className="space-y-1 px-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg border border-transparent px-3 py-4 text-base transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-5 w-5 text-muted-foreground/50 transition-transform group-hover:text-foreground",
                    pathname === link.href && "text-foreground rotate-90"
                  )} />
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {userRole && userRole !== "CUSTOMER" && renderSidebar()}
            <div className={`flex-1 ${userRole && userRole !== "CUSTOMER" && sidebarOpen ? "pl-72" : ""}`}>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  <div className="container py-6">
                    {userRole && userRole !== "CUSTOMER" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="fixed top-3 left-3 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                        onClick={toggleSidebar}
                      >
                        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                      </Button>
                    )}
                    {children}
                  </div>
                </main>
                {showFooter && <Footer />}
              </div>
            </div>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  )
}