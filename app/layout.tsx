"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            {!isAdminPage && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdminPage && <Footer />}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}