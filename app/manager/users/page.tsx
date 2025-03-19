"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchAllUsersManager } from "@/app/api/userManagerApi"
import { useRouter } from "next/navigation"

interface User {
  userID: string
  fullName: string
  email: string
  phone: string | null
  address: string | null
  skinType: string | null
  loyalPoints: number
  role: string
  orders: any | null
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsersManager()
        setUsers(response.data)
      } catch (error) {
        console.error("Failed to load users:", error)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => router.push('/manager/users/create')}>
          Create New User
        </Button>
      </div>

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
            {users.map((user) => (
              <tr key={user.userID}>
                <td className="px-6 py-4">{user.userID}</td>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone || 'N/A'}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/manager/users/${user.userID}`)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

