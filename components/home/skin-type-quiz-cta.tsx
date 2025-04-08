'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function SkinTypeQuizCTA() {
  const [isClient, setIsClient] = useState(false)
  const [quizLink, setQuizLink] = useState("/skin-quiz")

  useEffect(() => {
    setIsClient(true)
    const jwtToken = localStorage.getItem("jwtToken")
    if (!jwtToken) {
      setQuizLink("/login?redirect=/skin-quiz")
    }
  }, [])

  const handleQuizClick = () => {
    if (!localStorage.getItem("jwtToken")) {
      toast({
        title: "Authentication Required",
        description: "Please log in to take the skin quiz.",
        variant: "default",
      })
    }
  }

  return (
    <section className="container py-12">
      <div className="rounded-lg overflow-hidden bg-muted/50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Not sure what your skin needs?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Take our 2-minute skin type quiz to discover your skin profile and
              get personalized product recommendations tailored just for you.
            </p>
            <div className="mt-8">
              <Link href={quizLink}>
                <Button onClick={handleQuizClick} size="lg">
                  Start Skin Quiz
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <Image
              src="/assets/Home/1.png"
              alt="Skin analysis"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
