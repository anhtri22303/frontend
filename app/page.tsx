import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { SkinTypeQuizCTA } from "@/components/home/skin-type-quiz-cta"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { BenefitsSection } from "@/components/home/benefits-section"
import ChatBox from "@/components/chat/ChatBox"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <FeaturedProducts />
      <SkinTypeQuizCTA />
      <BenefitsSection />
      <TestimonialsSection />
      <ChatBox />
    </div>
  )
}

