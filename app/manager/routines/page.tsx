"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRoutines, fetchRoutinesBySkinType, searchRoutinesByName, fetchRoutineById } from "@/app/api/routineApi";
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
import { Loader2, Search, RotateCcw, Filter, FileSearch, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

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
  const [routineIDFilter, setRoutineIDFilter] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadRoutines();
  }, []);
  
  useEffect(() => {
    // Calculate total pages whenever routines array changes
    setTotalPages(Math.ceil(routines.length / itemsPerPage));
    // Reset to first page when data changes
    setCurrentPage(1);
  }, [routines]);

  const loadRoutines = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoutines();
      setRoutines(data);
      toast.success("Routines loaded successfully");
    } catch (error) {
      console.error("Failed to load routines:", error);
      setRoutines([]);
      toast.error("Failed to load routines");
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
        toast.success(`Filtered ${data.length} routines for ${skinType} skin type`);
        console.log("Fetched routines by skin type:", data);
      } catch (error) {
        console.error("Failed to fetch routines by skin type:", error);
        setRoutines([]);
        toast.error("Failed to filter routines by skin type");
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
      console.log("Search routine by name success:", data);
      setRoutines(data);
      toast.success(`Found ${data.length} routines matching "${searchName}"`);
    } catch (error) {
      console.error("Failed to search routines:", error);
      setRoutines([]);
      toast.error("Failed to search routines");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoutineIDSearch = async () => {
    if (!routineIDFilter.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetchRoutineById(routineIDFilter);
      if (response.data) {
        setRoutines([response.data]);
        toast.success("Routine found");
      } else {
        setRoutines([]);
        toast.error("No routine found with that ID");
      }
    } catch (error) {
      console.error("Failed to fetch routine by ID:", error);
      setRoutines([]);
      toast.error("Failed to fetch routine by ID");
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchName("");
    setRoutineIDFilter("");
    setSelectedSkinType("");
    loadRoutines();
    toast.success("Filters reset");
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return routines.slice(startIndex, endIndex);
  };

  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add first page
      pages.push(1);
      
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always add last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Skincare Routines
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="transition-all duration-200 flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
          <Button
            onClick={() => router.push("/manager/routines/create")}
            className="transition-all duration-200"
          >
            + Create New Routine
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
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
                className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button
              onClick={handleSearch}
              className="transition-all duration-200 flex items-center gap-1"
              size="sm"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Filter by Routine ID..."
                value={routineIDFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoutineIDFilter(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && handleRoutineIDSearch()
                }
                className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 w-full"
              />
              <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button
              onClick={handleRoutineIDSearch}
              className="transition-all duration-200 flex items-center gap-1"
              size="sm"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1">
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
          </div>
          <Button
            onClick={() => handleSkinTypeChange(selectedSkinType || "ALL")}
            className="transition-all duration-200 flex items-center gap-1"
            size="default"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : routines.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getCurrentPageData().map((routine) => (
              <Card
                key={routine.routineID}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-lg"
              >
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {routine.routineName}
                  </CardTitle>
                  <div className="text-xs text-gray-500">ID: {routine.routineID}</div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {routine.routineDescription}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Skin Type: <span className="text-primary">{routine.skinType}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/manager/routines/${routine.routineID}`)}
                        className="transition-all duration-200"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/manager/routines/${routine.routineID}/edit`)}
                        className="transition-all duration-200"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {routines.length > itemsPerPage && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-10 h-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2">
                    {page}
                  </span>
                )
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Pagination Info */}
          {routines.length > 0 && (
            <div className="text-center text-sm text-gray-500 mt-2">
              Showing {Math.min(routines.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(routines.length, currentPage * itemsPerPage)} of {routines.length} routines
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No routines found.</p>
          <p className="text-sm mt-2">Try adjusting your search or create a new routine.</p>
        </div>
      )}
    </div>
  );
}