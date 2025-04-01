"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRoutines, fetchRoutinesBySkinType, searchRoutinesByName } from "@/app/api/routineApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react"; // Giả sử bạn có icon từ lucide-react

interface Routine {
  routineID: string;
  skinType: string;
  routineName: string;
  routineDescription: string;
}

export default function RoutineList() {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [searchName, setSearchName] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoutines();
      setRoutines(data);
    } catch (error) {
      console.error("Failed to load routines:", error);
      setRoutines([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkinTypeChange = async (skinType: string) => {
    setSelectedSkinType(skinType);
    if (skinType !== "ALL") {
      setIsLoading(true);
      try {
        const data = await fetchRoutinesBySkinType(skinType);
        setRoutines(data);
      } catch (error) {
        console.error("Failed to fetch routines by skin type:", error);
        setRoutines([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      loadRoutines();
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      loadRoutines();
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchRoutinesByName(searchName);
      setRoutines(data);
    } catch (error) {
      console.error("Failed to search routines:", error);
      setRoutines([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Skincare Routines
        </h1>
        <Button
          onClick={() => router.push("/staff/routines/create")}
          className="transition-all duration-200"
        >
          + Create New Routine
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchName(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSearch()
            }
            className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Select value={selectedSkinType} onValueChange={handleSkinTypeChange}>
          <SelectTrigger className="border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200">
            <SelectValue placeholder="Select skin type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Skin Types</SelectItem>
            <SelectItem value="Dry">Dry</SelectItem>
            <SelectItem value="Oily">Oily</SelectItem>
            <SelectItem value="Combination">Combination</SelectItem>
            <SelectItem value="Sensitive">Sensitive</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSearch}
          className="transition-all duration-200"
        >
          Search
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : routines.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <Card
              key={routine.routineID}
              className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-lg"
            >
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {routine.routineName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {routine.routineDescription}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700">
                    Skin Type: <span className="text-primary">{routine.skinType}</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/staff/routines/${routine.routineID}/edit`)}
                    className="transition-all duration-200"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No routines found.</p>
          <p className="text-sm mt-2">Try adjusting your search or create a new routine.</p>
        </div>
      )}
    </div>
  );
}