"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

type RoutineStep = {
  id: number
  name: string
  product: string
  notes: string
}

type SkinCareRoutine = {
  id: number
  name: string
  steps: RoutineStep[]
}

type CustomRoutineProps = {
  userRoutines: SkinCareRoutine[]
  setUserRoutines: React.Dispatch<React.SetStateAction<SkinCareRoutine[]>>
}

export function CustomRoutine({ userRoutines, setUserRoutines }: CustomRoutineProps) {
  const [steps, setSteps] = useState<RoutineStep[]>([])

  const addStep = () => {
    const newStep: RoutineStep = {
      id: Date.now(),
      name: "",
      product: "",
      notes: "",
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id: number, field: keyof RoutineStep, value: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const removeStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const saveRoutine = () => {
    // In a real app, you would save this to a backend
    console.log("Saving routine:", steps)
    alert("Routine saved successfully!")
  }

  return (
    <div className="space-y-6">
      <p className="text-lg">Create your custom skincare routine:</p>
      {steps.map((step, index) => (
        <Card key={step.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Step {index + 1}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`step-name-${step.id}`}>Step Name</Label>
                  <Input
                    id={`step-name-${step.id}`}
                    value={step.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStep(step.id, "name", e.target.value)}
                    placeholder="e.g., Cleanse, Tone, Moisturize"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`step-product-${step.id}`}>Product</Label>
                  <Input
                    id={`step-product-${step.id}`}
                    value={step.product}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStep(step.id, "product", e.target.value)}
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`step-notes-${step.id}`}>Notes</Label>
                <Textarea
                  id={`step-notes-${step.id}`}
                  value={step.notes}
                  onChange={(e) => updateStep(step.id, "notes", e.target.value)}
                  placeholder="Any special instructions or notes"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addStep} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Step
      </Button>
      {steps.length > 0 && (
        <Button onClick={saveRoutine} className="w-full">
          Save Routine
        </Button>
      )}
    </div>
  )
}

