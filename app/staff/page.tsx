"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  X,
  Sparkles,
  Droplets,
  Search,
  Filter,
  Sun,
  Moon,
  Plus,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoutineList() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sample routine data
  const routines = [
    {
      id: "1",
      name: "Brightening Morning Routine",
      description: "A gentle morning routine focused on brightening and protecting the skin",
      type: "morning",
      difficulty: "beginner",
      duration: "5 min",
      steps: 4,
      skinTypes: ["All Skin Types"],
      concerns: ["Dullness", "Hyperpigmentation"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 245,
    },
    {
      id: "2",
      name: "Hydrating Night Routine",
      description: "Deeply hydrating evening routine to repair and nourish skin overnight",
      type: "evening",
      difficulty: "beginner",
      duration: "7 min",
      steps: 5,
      skinTypes: ["Dry", "Normal"],
      concerns: ["Dryness", "Fine Lines"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviews: 189,
    },
    {
      id: "3",
      name: "Anti-Aging Complete Routine",
      description: "Comprehensive routine targeting signs of aging with powerful actives",
      type: "complete",
      difficulty: "advanced",
      duration: "10 min",
      steps: 7,
      skinTypes: ["Mature", "Normal", "Combination"],
      concerns: ["Fine Lines", "Wrinkles", "Firmness"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      reviews: 312,
    },
    {
      id: "4",
      name: "Acne-Fighting Routine",
      description: "Targeted routine to combat acne and prevent breakouts",
      type: "complete",
      difficulty: "intermediate",
      duration: "8 min",
      steps: 6,
      skinTypes: ["Oily", "Acne-Prone"],
      concerns: ["Acne", "Oiliness", "Redness"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      reviews: 278,
    },
    {
      id: "5",
      name: "Sensitive Skin Soother",
      description: "Ultra-gentle routine to calm and protect sensitive skin",
      type: "morning",
      difficulty: "beginner",
      duration: "5 min",
      steps: 4,
      skinTypes: ["Sensitive"],
      concerns: ["Redness", "Irritation", "Sensitivity"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 156,
    },
    {
      id: "6",
      name: "Exfoliating Treatment Routine",
      description: "Weekly exfoliation routine to reveal smoother, brighter skin",
      type: "treatment",
      difficulty: "intermediate",
      duration: "15 min",
      steps: 5,
      skinTypes: ["All Skin Types"],
      concerns: ["Texture", "Dullness", "Uneven Tone"],
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviews: 203,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-10 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Skincare Routines</h1>
                <p className="text-muted-foreground">Browse and manage your curated skincare routines</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Routine</span>
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search routines..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Routine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Skin Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skin Types</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Routine Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
                <TabsTrigger value="all">All Routines</TabsTrigger>
                <TabsTrigger value="morning" className="flex items-center gap-1">
                  <Sun className="h-4 w-4" />
                  <span>Morning</span>
                </TabsTrigger>
                <TabsTrigger value="evening" className="flex items-center gap-1">
                  <Moon className="h-4 w-4" />
                  <span>Evening</span>
                </TabsTrigger>
                <TabsTrigger value="treatment">Treatments</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routines.map((routine) => (
                    <Card key={routine.id} className="overflow-hidden flex flex-col h-full">
                      <div className="relative h-48 w-full">
                        <Image
                          src={routine.image || "/placeholder.svg"}
                          alt={routine.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              routine.type === "morning"
                                ? "default"
                                : routine.type === "evening"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="capitalize"
                          >
                            {routine.type === "morning" ? (
                              <div className="flex items-center gap-1">
                                <Sun className="h-3 w-3" />
                                <span>{routine.type}</span>
                              </div>
                            ) : routine.type === "evening" ? (
                              <div className="flex items-center gap-1">
                                <Moon className="h-3 w-3" />
                                <span>{routine.type}</span>
                              </div>
                            ) : (
                              <span className="capitalize">{routine.type}</span>
                            )}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{routine.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {routine.skinTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{routine.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>
                              {routine.rating} ({routine.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {routine.concerns.map((concern, index) => (
                            <span key={index} className="text-xs text-muted-foreground">
                              {index > 0 ? " • " : ""}
                              {concern}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between items-center w-full">
                          <Badge variant="outline" className="font-normal">
                            {routine.steps} steps
                          </Badge>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="morning" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routines
                    .filter((routine) => routine.type === "morning")
                    .map((routine) => (
                      <Card key={routine.id} className="overflow-hidden flex flex-col h-full">
                        <div className="relative h-48 w-full">
                          <Image
                            src={routine.image || "/placeholder.svg"}
                            alt={routine.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="capitalize flex items-center gap-1">
                              <Sun className="h-3 w-3" />
                              <span>Morning</span>
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{routine.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {routine.skinTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{routine.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>
                                {routine.rating} ({routine.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {routine.concerns.map((concern, index) => (
                              <span key={index} className="text-xs text-muted-foreground">
                                {index > 0 ? " • " : ""}
                                {concern}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between items-center w-full">
                            <Badge variant="outline" className="font-normal">
                              {routine.steps} steps
                            </Badge>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <span>View Details</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="evening" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routines
                    .filter((routine) => routine.type === "evening")
                    .map((routine) => (
                      <Card key={routine.id} className="overflow-hidden flex flex-col h-full">
                        <div className="relative h-48 w-full">
                          <Image
                            src={routine.image || "/placeholder.svg"}
                            alt={routine.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="capitalize flex items-center gap-1">
                              <Moon className="h-3 w-3" />
                              <span>Evening</span>
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{routine.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {routine.skinTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{routine.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>
                                {routine.rating} ({routine.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {routine.concerns.map((concern, index) => (
                              <span key={index} className="text-xs text-muted-foreground">
                                {index > 0 ? " • " : ""}
                                {concern}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between items-center w-full">
                            <Badge variant="outline" className="font-normal">
                              {routine.steps} steps
                            </Badge>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <span>View Details</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="treatment" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {routines
                    .filter((routine) => routine.type === "treatment")
                    .map((routine) => (
                      <Card key={routine.id} className="overflow-hidden flex flex-col h-full">
                        <div className="relative h-48 w-full">
                          <Image
                            src={routine.image || "/placeholder.svg"}
                            alt={routine.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="capitalize bg-background">
                              Treatment
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{routine.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{routine.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {routine.skinTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{routine.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>
                                {routine.rating} ({routine.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {routine.concerns.map((concern, index) => (
                              <span key={index} className="text-xs text-muted-foreground">
                                {index > 0 ? " • " : ""}
                                {concern}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between items-center w-full">
                            <Badge variant="outline" className="font-normal">
                              {routine.steps} steps
                            </Badge>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <span>View Details</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Featured Routine */}
            <Card className="bg-muted/50 border-dashed">
              <CardHeader>
                <CardTitle>Create Custom Routine</CardTitle>
                <CardDescription>Build a personalized skincare routine for your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative h-40 w-full md:w-64 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=160&width=256"
                      alt="Custom Routine"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Why create a custom routine?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="h-2 w-2 rounded-full bg-primary-foreground"></span>
                        </div>
                        <span>Personalize for specific skin concerns and types</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="h-2 w-2 rounded-full bg-primary-foreground"></span>
                        </div>
                        <span>Curate product combinations for optimal results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="h-2 w-2 rounded-full bg-primary-foreground"></span>
                        </div>
                        <span>Increase customer engagement and satisfaction</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:self-end">
                    <Button className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Create Routine</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

