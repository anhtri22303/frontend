"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

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

type PersonalizedRoutineProps = {
  userRoutines: SkinCareRoutine[]
}

export function PersonalizedRoutine({ userRoutines }: PersonalizedRoutineProps) {
  const { user } = useAuth()

  if (!user?.skinType) {
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

  const personalizedRoutine = userRoutines.find((routine) => routine.skinType === user.skinType)

  if (!personalizedRoutine) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Personalized Routine Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We couldn't find a personalized routine for your skin type. Please contact customer support.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-lg">
        Your personalized routine for <span className="font-semibold">{user.skinType}</span> skin:
      </p>
      <Card>
        <CardHeader>
          <CardTitle>{personalizedRoutine.routineName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{personalizedRoutine.description}</p>
          <ul className="space-y-4">
            {personalizedRoutine.products.map((product) => (
              <li key={product.id} className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/shop">Shop Recommended Products</Link>
      </Button>
    </div>
  )
}

