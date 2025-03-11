import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          opacity: 0.2,
        }}
      />
      <div className="container relative py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
          Discover Your Perfect Skincare Routine
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          Personalized recommendations based on your unique skin type. Take our quiz and find products that work for
          you.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/skin-quiz">Take Skin Quiz</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Shop Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

