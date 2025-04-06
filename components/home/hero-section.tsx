"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function HeroSection() {
  const [quizLink, setQuizLink] = useState("/skin-quiz")

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken")
    if (!jwtToken) {
      setQuizLink("/login?redirect=/skin-quiz")
    }
  }, [])

  const handleSkinQuizClick = () => {
    if (!localStorage.getItem("jwtToken")) {
      toast({
        title: "Authentication Required",
        description: "Please log in to take the skin quiz.",
        variant: "default",
      })
    }
  }

  return (
    <section className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("/assets/Home/3.png")`, // Sử dụng url() và đường dẫn tương đối từ thư mục public
          opacity: 0.2,
        }}
      />
      <div className="container relative py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
          Discover Your Perfect Skincare Routine
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Personalized recommendations based on your unique skin type. Take our
          quiz and find products that work for you.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href={quizLink}>
            <Button onClick={handleSkinQuizClick} size="lg">
              Take Skin Quiz
            </Button>
          </Link>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Shop Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

