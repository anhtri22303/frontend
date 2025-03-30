'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { fetchFeedbacks, Feedback } from "@/app/api/feedbackApi"

export function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFeedbacks()
        setFeedbacks(data)
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="container py-12">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">What Our Customers Say</h2>
        <p className="text-center">Loading testimonials...</p>
      </section>
    )
  }

  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-4">What Our Customers Say</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Real results from real people who found their perfect skincare routine with GlowCorner
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {feedbacks.map((feedback) => (
          <Card key={feedback.feedbackID}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/placeholder.svg" // Placeholder image for now
                  alt="Customer"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">Customer {feedback.customerID}</h3>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < feedback.rating ? "text-primary fill-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{feedback.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}