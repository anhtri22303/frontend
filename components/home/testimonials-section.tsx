import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "The skin quiz was so accurate! I've been using the recommended products for a month now and my skin has never looked better. The hydrating cleanser is a game-changer for my dry skin.",
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/placeholder.svg?height=80&width=80",
    rating: 4,
    text: "As someone with sensitive skin, I've always struggled to find products that don't cause irritation. GlowCorner's recommendations were spot on, and their customer service is exceptional.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "I love how personalized the experience is. The products I received after taking the quiz have helped clear my acne-prone skin. I'm a customer for life!",
  },
]

export function TestimonialsSection() {
  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-4">What Our Customers Say</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Real results from real people who found their perfect skincare routine with GlowCorner
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-primary fill-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

