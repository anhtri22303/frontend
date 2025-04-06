"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCustomers, fetchUserById, fetchUserByName, fetchUserByEmail } from "@/app/api/userManagerApi";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
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
      }
    };
    loadUsers();
  }, []);

  const handleSearchById = async () => {
    if (!searchId) return;
    const user = await fetchUserById(searchId);
    setUsers(user && user.role === "CUSTOMER" ? [user] : []);
  };

  const handleSearchByName = async () => {
    if (!searchName) return;
    const users = await fetchUserByName(searchName);
    const customers = users?.filter((user: User) => user.role === "CUSTOMER") || [];
    setUsers(customers);
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail) return;
    const user = await fetchUserByEmail(searchEmail);
    setUsers(user && user.role === "CUSTOMER" ? [user] : []);
  };

  const handleResetFilters = async () => {
    setSearchId("");
    setSearchName("");
    setSearchEmail("");
    const response = await fetchCustomers();
    if (response?.data && Array.isArray(response.data)) {
      const customers = response.data.filter((user) => user.role === "CUSTOMER");
      setUsers(customers);
    } else {
      setUsers([]);
    }
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
            <Button onClick={handleSearchById}>Search</Button>
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
            <Button onClick={handleSearchByName}>Search</Button>
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
            <Button onClick={handleSearchByEmail}>Search</Button>
          </div>
        </div>
      </div>

      {/* Reset Filters */}
      <div className="flex justify-end mb-6">
        <Button variant="outline" onClick={handleResetFilters}>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userID}>
                  <td className="px-6 py-4">{user.userID}</td>
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || "N/A"}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/manager/customers/${user.userID}/edit`)}
                    >
                      Edit
                    </Button>
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
    </div>
  );
}

