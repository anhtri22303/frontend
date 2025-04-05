"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRoutineById, updateRoutine } from "@/app/api/routineApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  productID: string;
  productName: string;
}

interface Routine {
  routineID: string;
  skinType: string;
  routineName: string;
  routineDescription: string;
  products?: Product[]; 
}

interface RoutineEditPageProps {
  params: {
    routineID: string
  }
}

export default function RoutineEditPage({ params }: RoutineEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [routine, setRoutine] = useState<Routine>({
    routineID: "",
    skinType: "",
    routineName: "",
    routineDescription: "",
    products: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Danh sách các loại da
  const skinTypes = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];

  useEffect(() => {
    const loadRoutine = async () => {
      // Kiểm tra xem routineID có tồn tại không
      if (!params.routineID) {
        setError("Routine ID is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchRoutineById(params.routineID);
        console.log("Routine data:", response.data);
        
        if (!response.data) {
          setError("Routine not found.");
          return;
        }
        
        setRoutine(response.data);
      } catch (err) {
        console.error("Failed to fetch routine:", err);
        setError("Failed to load routine details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutine();
  }, [params.routineID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoutine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkinTypeChange = (value: string) => {
    setRoutine(prev => ({
      ...prev,
      skinType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (!routine.routineName.trim()) {
      setError("Routine name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!routine.skinType) {
      setError("Skin type is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit form data
      const updatedData = {
        routineID: routine.routineID,
        routineName: routine.routineName,
        routineDescription: routine.routineDescription,
        skinType: routine.skinType
      };
      
      await updateRoutine(params.routineID, updatedData);
      
      toast({
        title: "Success",
        description: "Routine updated successfully!",
        variant: "default",
      });
      
      // Redirect to routine details page
      router.push(`/manager/routines/${params.routineID}`);
    } catch (err) {
      console.error("Failed to update routine:", err);
      setError("Failed to update routine. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update routine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !routine.routineID) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500 py-12">
        <p className="text-lg">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/manager/routines")}
          className="mt-4 transition-all duration-200"
        >
          Back to Routines
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/manager/routines")}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Routine</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Routine Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineID">
                Routine ID
              </label>
              <Input
                id="routineID"
                name="routineID"
                value={routine.routineID}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineName">
                Routine Name *
              </label>
              <Input
                id="routineName"
                name="routineName"
                value={routine.routineName}
                onChange={handleInputChange}
                placeholder="Enter routine name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="skinType">
                Skin Type *
              </label>
              <Select
                value={routine.skinType}
                onValueChange={handleSkinTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skin type" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="routineDescription">
                Description
              </label>
              <Textarea
                id="routineDescription"
                name="routineDescription"
                value={routine.routineDescription}
                onChange={handleInputChange}
                placeholder="Enter routine description"
                rows={5}
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/manager/routines/${params.routineID}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}