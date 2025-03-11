"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalizedRoutine } from "../../components/routines/personalized-routine"
import { CustomRoutine } from "../../components/routines/custom-routine"
import { RoutineProgress } from "../../components/routines/routine-progress"

type SkinCareRoutine = {
  id: string
  skinType: string
  routineName: string
  description: string
  products: {
    id: string
    name: string
    description: string
  }[]
}

export default function RoutinesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personalized")
  const [userRoutines, setUserRoutines] = useState<SkinCareRoutine[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/routines")
    } else {
      // Fetch user routines from API
      // For now, we'll use mock data
      const mockRoutines: SkinCareRoutine[] = [
        {
          id: "1",
          skinType: "combination",
          routineName: "Morning Routine",
          description: "A gentle routine to start your day",
          products: [
            { id: "p1", name: "Gentle Cleanser", description: "Cleanse your face" },
            { id: "p2", name: "Hydrating Toner", description: "Balance your skin's pH" },
            { id: "p3", name: "Lightweight Moisturizer", description: "Hydrate your skin" },
            { id: "p4", name: "Sunscreen SPF 30", description: "Protect your skin from UV rays" },
          ],
        },
        {
          id: "2",
          skinType: "combination",
          routineName: "Evening Routine",
          description: "A nourishing routine to end your day",
          products: [
            { id: "p5", name: "Oil Cleanser", description: "Remove makeup and sunscreen" },
            { id: "p6", name: "Foam Cleanser", description: "Deep cleanse your skin" },
            { id: "p7", name: "Exfoliating Toner", description: "Gently exfoliate and brighten" },
            { id: "p8", name: "Hydrating Serum", description: "Boost hydration" },
            { id: "p9", name: "Night Cream", description: "Nourish and repair your skin overnight" },
          ],
        },
      ]
      setUserRoutines(mockRoutines)
    }
  }, [user, router])

  if (!user) {
    return null // Prevent flash of content before redirect
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Skincare Routines</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="personalized">Personalized Routine</TabsTrigger>
          <TabsTrigger value="custom">Custom Routine</TabsTrigger>
          <TabsTrigger value="progress">Routine Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="personalized">
          <PersonalizedRoutine userRoutines={userRoutines} />
        </TabsContent>

        <TabsContent value="custom">
          <CustomRoutine userRoutines={userRoutines} setUserRoutines={setUserRoutines} />
        </TabsContent>

        <TabsContent value="progress">
          <RoutineProgress userRoutines={userRoutines} />
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Need help with your routine?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Our skincare experts are here to help you achieve your best skin.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Book a Consultation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book a Skincare Consultation</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <p>This is where you would implement your consultation booking form.</p>
                  <Button onClick={() => router.push("/consultation")}>Go to Consultation Booking</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}