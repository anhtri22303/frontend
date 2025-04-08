"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCustomers, fetchUserById, fetchUserByName, fetchUserByEmail, deleteUser } from "@/app/api/userManagerApi";
import { useRouter } from "next/navigation";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface User {
  userID: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  skinType: string | null;
  loyalPoints: number;
  role: string;
  orders: any | null;
}

export default function CustomerList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Calculate total pages whenever users array changes
    setTotalPages(Math.ceil(users.length / itemsPerPage));
    // Reset to first page when data changes
    setCurrentPage(1);
  }, [users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCustomers();
      if (response?.data && Array.isArray(response.data)) {
        const customers = response.data.filter((user) => user.role === "CUSTOMER");
        setUsers(customers);
      } else {
        setUsers([]);
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    setIsLoading(true);
    try {
      const user = await fetchUserById(searchId);
      setUsers(user && user.role === "CUSTOMER" ? [user] : []);
    } catch (error) {
      console.error("Error searching user by ID:", error);
      toast.error("Failed to find user");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) return;
    setIsLoading(true);
    try {
      const users = await fetchUserByName(searchName);
      const customers = users?.filter((user: User) => user.role === "CUSTOMER") || [];
      setUsers(customers);
    } catch (error) {
      console.error("Error searching users by name:", error);
      toast.error("Failed to find users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    setIsLoading(true);
    try {
      const user = await fetchUserByEmail(searchEmail);
      setUsers(user && user.role === "CUSTOMER" ? [user] : []);
    } catch (error) {
      console.error("Error searching user by email:", error);
      toast.error("Failed to find user");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchId("");
    setSearchName("");
    setSearchEmail("");
    loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        await deleteUser(userId);
        toast.success("Customer deleted successfully");
        loadUsers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer");
      }
    }
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/manager/customers/${userId}/edit`);
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button onClick={() => router.push("/manager/users/create")}>Create New Customer</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search by ID</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter Customer ID"
            />
            <Button onClick={handleSearchById} disabled={isLoading}>Search</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search by Name</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter Customer Name"
            />
            <Button onClick={handleSearchByName} disabled={isLoading}>Search</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search by Email</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter Customer Email"
            />
            <Button onClick={handleSearchByEmail} disabled={isLoading}>Search</Button>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          disabled={isLoading}
        >
          Reset Filters
        </Button>
      </div>

      {/* Customer Table */}
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyal Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              getCurrentPageData().map((user) => (
                <tr key={user.userID}>
                  <td className="px-6 py-4">{user.userID}</td>
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || "N/A"}</td>
                  <td className="px-6 py-4">{user.loyalPoints || 0}</td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(user.userID)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.userID)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
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
      {!isLoading && users.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {Math.min(users.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(users.length, currentPage * itemsPerPage)} of {users.length} customers
        </div>
      )}
    </div>
  );
}