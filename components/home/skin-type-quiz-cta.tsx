import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function SkinTypeQuizCTA() {
  return (
    <section className="container py-12">
      <div className="rounded-lg overflow-hidden bg-muted/50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight">Not sure what your skin needs?</h2>
            <p className="mt-4 text-muted-foreground">
              Take our 2-minute skin type quiz to discover your skin profile and get personalized product
              recommendations tailored just for you.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/skin-quiz">Start Skin Quiz</Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[300px]">
            <Image src="/placeholder.svg?height=600&width=600" alt="Skin analysis" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

