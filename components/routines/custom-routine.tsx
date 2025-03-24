"use client"

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { createRoutine } from "@/app/api/routineApi"

type RoutineStep = {
  name: string
  product: string
  notes: string
}

interface SkinCareRoutine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

export function CustomRoutine() {
  const [steps, setSteps] = useState<RoutineStep[]>([])
  const [routineName, setRoutineName] = useState("")
  const [routineDescription, setRoutineDescription] = useState("")

  const addStep = () => {
    const newStep: RoutineStep = {
      name: "",
      product: "",
      notes: "",
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (index: number, field: keyof RoutineStep, value: string) => {
    setSteps(steps.map((step, i) => (i === index ? { ...step, [field]: value } : step)))
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const saveRoutine = async () => {
    try {
      const newRoutine = {
        category: "custom",
        routineName: routineName,
        routineDescription: routineDescription
      }
      
      await createRoutine(newRoutine)
      // Reset form
      setRoutineName("")
      setRoutineDescription("")
      setSteps([])
    } catch (error) {
      console.error("Error saving routine:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Custom Routine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="routineName">Routine Name</Label>
              <Input
                id="routineName"
                value={routineName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRoutineName(e.target.value)}
                placeholder="e.g., Evening Routine"
              />
            </div>
            <div>
              <Label htmlFor="routineDescription">Description</Label>
              <Textarea
                id="routineDescription"
                value={routineDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRoutineDescription(e.target.value)}
                placeholder="Describe your routine..."
              />
            </div>
            <div className="space-y-4">
              <Label>Steps</Label>
              {steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label>Step Name</Label>
                          <Input
                            value={step.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateStep(index, "name", e.target.value)}
                            placeholder="e.g., Cleanse"
                          />
                        </div>
                        <div>
                          <Label>Product</Label>
                          <Input
                            value={step.product}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => updateStep(index, "product", e.target.value)}
                            placeholder="e.g., Gentle Cleanser"
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={step.notes}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateStep(index, "notes", e.target.value)}
                            placeholder="Any special instructions..."
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="mt-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addStep} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </div>
            <Button onClick={saveRoutine} className="w-full" disabled={!routineName || steps.length === 0}>
              Save Routine
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
