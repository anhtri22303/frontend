"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, ShoppingBag, FileQuestion, Gift, Clock, Shield } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/about-hero.jpg"
            alt="Beauty Products"
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
          <h1 className="text-5xl font-bold mb-6">Your Journey to Natural Beauty</h1>
          <p className="text-xl mb-8">Discover personalized skincare routines and premium products tailored just for you</p>
          <Button 
            size="lg" 
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => window.location.href = '/skin-quiz'}
          >
            <FileQuestion className="mr-2 h-5 w-5" />
            Take Beauty Quiz
          </Button>
        </motion.div>
      </section>

      {/* Business Rules Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Business Rules</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Quality Guarantee</CardTitle>
                <CardDescription>
                  All products are carefully selected and tested for quality assurance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>100% authentic products</li>
                  <li>Dermatologically tested</li>
                  <li>Cruelty-free certification</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Shopping Policy</CardTitle>
                <CardDescription>
                  Simple and secure shopping experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Free shipping on orders over $50</li>
                  <li>30-day money-back guarantee</li>
                  <li>Secure payment methods</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Gift className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Rewards Program</CardTitle>
                <CardDescription>
                  Earn points with every purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>1 point for every $1 spent</li>
                  <li>Special birthday rewards</li>
                  <li>Exclusive member discounts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Order Process Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <h2 className="text-3xl font-bold text-center mb-12">How to Order</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Take Beauty Quiz</h3>
              <p className="text-gray-600">Get personalized product recommendations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Add to Cart</h3>
              <p className="text-gray-600">Select your favorite products</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Pay safely with multiple options</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your order within 3-5 days</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Beauty Quiz Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={fadeIn.transition}
        >
          <h2 className="text-3xl font-bold mb-6">Personalized Beauty Quiz</h2>
          <p className="text-xl text-gray-600 mb-8">
            Answer a few questions about your skin type, concerns, and preferences to get a customized skincare routine
          </p>
          <Card className="p-6 bg-gradient-to-r from-pink-100 to-purple-100">
            <CardContent className="space-y-4">
              <p className="font-medium">Our quiz helps you:</p>
              <ul className="text-left space-y-3">
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
                  Identify your skin type and concerns
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
                  Get product recommendations
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
                  Create a personalized skincare routine
                </li>
              </ul>
              <Button 
                size="lg" 
                className="mt-6 bg-pink-600 hover:bg-pink-700"
                onClick={() => window.location.href = '/skin-quiz'}
              >
                Start Quiz Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}