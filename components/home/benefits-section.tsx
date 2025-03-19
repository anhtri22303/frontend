import { CheckCircle, Shield, Sparkles, ThumbsUp } from "lucide-react"

const benefits = [
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: "Dermatologist Tested",
    description: "All our products are tested and approved by certified dermatologists for safety and efficacy.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Clean Ingredients",
    description: "We use only high-quality, non-toxic ingredients that are good for your skin and the environment.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Personalized Solutions",
    description: "Our skin analysis technology helps you find products that work specifically for your skin type.",
  },
  {
    icon: <ThumbsUp className="h-10 w-10 text-primary" />,
    title: "Satisfaction Guaranteed",
    description: "Try our products risk-free with our 30-day money-back guarantee if you're not completely satisfied.",
  },
]

export function BenefitsSection() {
  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Why Choose GlowCorner</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

