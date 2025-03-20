"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchRoutines, fetchRoutinesByCategory, searchRoutinesByName } from "@/app/api/routineApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Routine {
  routineID: string
  category: string
  routineName: string
  routineDescription: string
}

export default function RoutineList() {
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [searchName, setSearchName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadRoutines()
  }, [])

  const loadRoutines = async () => {
    setIsLoading(true)
    try {
      const data = await fetchRoutines()
      setRoutines(data)
    } catch (error) {
      console.error("Failed to load routines:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category)
    if (category !== "ALL") {  // Change this condition
      try {
        const data = await fetchRoutinesByCategory(category)
        setRoutines(data)
      } catch (error) {
        console.error("Failed to fetch routines by category:", error)
      }
    } else {
      loadRoutines()
    }
  }

  const handleSearch = async () => {
    if (!searchName.trim()) {
      loadRoutines()
      return
    }
    try {
      const data = await searchRoutinesByName(searchName)
      setRoutines(data)
    } catch (error) {
      console.error("Failed to search routines:", error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skincare Routines</h1>
        <Button onClick={() => router.push('/staff/routines/create')}>
          Create New Routine
        </Button>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>  {/* Change empty string to "ALL" */}
            <SelectItem value="DRY">Dry</SelectItem>
            <SelectItem value="OILY">Oily</SelectItem>
            <SelectItem value="COMBINATION">Combination</SelectItem>
            <SelectItem value="SENSITIVE">Sensitive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <Card key={routine.routineID}>
            <CardHeader>
              <CardTitle>{routine.routineName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{routine.routineDescription}</p>
              <p className="text-sm">Category: {routine.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

