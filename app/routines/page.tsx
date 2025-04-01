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
import { fetchRoutinesBySkinType, fetchRoutineById } from "@/app/api/routineApi"

interface SkinCareRoutine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

export default function RoutinesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personalized")
  const [userRoutines, setUserRoutines] = useState<SkinCareRoutine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRoutines = async () => {
      if (!user) {
        router.push("/login?redirect=/routines");
        return;
      }
  
      try {
        const userID = localStorage.getItem("userID");
        if (!userID) {
          router.push("/login?redirect=/routines");
          return;
        }
  
        const skinType = localStorage.getItem("userSkinType"); // Ví dụ: "Oily"
        if (skinType) {
          // Chỉ gửi skinType, không nối với routineCategory
          const routines = await fetchRoutinesBySkinType(skinType); // Gửi "Oily"
          setUserRoutines(routines);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routines:", error);
        setLoading(false);
      }
    };
  
    fetchUserRoutines();
  }, [user, router]);

  if (loading) {
    return <div className="container py-12">Loading...</div>
  }

  return (
    <div className="container py-12">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personalized">Personalized Routines</TabsTrigger>
          <TabsTrigger value="custom">Custom Routines</TabsTrigger>
        </TabsList>
        <TabsContent value="personalized">
          <PersonalizedRoutine routines={userRoutines} />
        </TabsContent>
        <TabsContent value="custom">
          <CustomRoutine />
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <RoutineProgress />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}