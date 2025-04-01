"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Leaf, Shield, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function OurStoryPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/assets/Home/3.png"
            alt="Our Story"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <motion.div 
          className="relative z-10 max-w-3xl mx-auto text-white"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl">Empowering Your Natural Beauty Journey</p>
        </motion.div>
      </section>

      {/* Story Content */}
      <section className="py-16 px-4">
        <motion.div 
          className="max-w-4xl mx-auto space-y-12"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          {/* Beginning */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">The Beginning</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2023, GlowCorner emerged from a simple yet powerful vision: to revolutionize 
              skincare by making it truly personal. Our founder's journey began with a common frustration - 
              the overwhelming number of skincare products available, yet the difficulty in finding the 
              right ones for individual needs.
            </p>
          </div>

          {/* Our Philosophy */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At GlowCorner, we believe that skincare isn't one-size-fits-all. Each person's skin 
              tells a unique story, and we're here to listen. Our approach combines cutting-edge 
              science with natural ingredients to create solutions that work in harmony with your skin.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We're committed to transparency, sustainability, and the belief that everyone deserves 
              to feel confident in their skin.
            </p>
          </div>

          {/* Core Values */}
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Customer First</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Your satisfaction and skin health are our top priorities
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Natural Ingredients</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Clean, sustainable ingredients that work in harmony with your skin
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Rigorous testing for safety and efficacy
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Innovation</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Continuous research and development for better skincare
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vision */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              Looking ahead, we envision a future where skincare is truly personalized, sustainable, 
              and accessible to everyone. We're committed to continuous innovation, environmental 
              responsibility, and creating a community where everyone can embrace their natural beauty. 
              Join us on this exciting journey as we revolutionize the world of skincare, one glowing 
              face at a time.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
} 