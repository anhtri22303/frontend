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
      setRoutines([]); // Đảm bảo routines là mảng rỗng nếu có lỗi
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skincare Routines</h1>
        <Button onClick={() => router.push("/manager/routines/create")}>
          Create New Routine
        </Button>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3">
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
          />
        </div>
        <Select value={selectedSkinType} onValueChange={handleSkinTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select skin type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Skin Type</SelectItem>
            <SelectItem value="Dry">Dry</SelectItem>
            <SelectItem value="Oily">Oily</SelectItem>
            <SelectItem value="Combination">Combination</SelectItem>
            <SelectItem value="Sensitive">Sensitive</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : routines.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => (
            <Card key={routine.routineID}>
              <CardHeader>
                <CardTitle>{routine.routineName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {routine.routineDescription}
                </p>
                <p className="text-sm">SkinType: {routine.skinType}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No routines match
        </div>
      )}
    </div>
  );
}