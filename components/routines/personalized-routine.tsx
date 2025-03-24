"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SkinCareRoutine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

type PersonalizedRoutineProps = {
  routines: SkinCareRoutine[]
}

export function PersonalizedRoutine({ routines }: PersonalizedRoutineProps) {
  const { user } = useAuth()

  if (!routines || routines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Skin Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Take our skin quiz to get a personalized skincare routine.</p>
          <Button asChild>
            <Link href="/skin-quiz">Take Skin Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {routines.map((routine) => (
        <Card key={routine.routineID}>
          <CardHeader>
            <CardTitle>{routine.routineName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{routine.routineDescription}</p>
            <p className="text-sm text-muted-foreground">Category: {routine.category}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
