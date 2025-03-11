"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

type ProgressDay = {
  date: Date
  completed: number
  total: number
}

export function RoutineProgress() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [progressData, setProgressData] = useState<ProgressDay[]>([])

  useEffect(() => {
    // In a real app, fetch this data from an API
    const mockData: ProgressDay[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(new Date().setDate(new Date().getDate() - i)),
      completed: Math.floor(Math.random() * 6),
      total: 5,
    }))
    setProgressData(mockData)
  }, [])

  const getProgressForDate = (date: Date) => {
    return progressData.find((day) => day.date.toDateString() === date.toDateString())
  }

  const selectedDayProgress = selectedDate ? getProgressForDate(selectedDate) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Routine Adherence</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => {
                const progress = getProgressForDate(date)
                if (!progress) return null
                const percentage = (progress.completed / progress.total) * 100
                return (
                  <Badge
                    variant={percentage >= 80 ? "default" : "secondary"}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {progress.completed}/{progress.total}
                  </Badge>
                )
              },
            }}
          />
        </CardContent>
      </Card>

      {selectedDayProgress && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Steps Completed:</span>
                <span>
                  {selectedDayProgress.completed} / {selectedDayProgress.total}
                </span>
              </div>
              <Progress value={(selectedDayProgress.completed / selectedDayProgress.total) * 100} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

