"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Mail, Phone } from "lucide-react"
import { getUsers } from "@/lib/firebase-service"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/firebase"
import { useEffect, useState } from "react"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-muted-foreground" />
        <span>{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as any
      return date?.toDate?.()?.toLocaleDateString() || 'N/A'
    },
  },
  {
    accessorKey: "subscribeNewsletter",
    header: "Newsletter",
    cell: ({ row }) => (
      <Badge variant={row.getValue("subscribeNewsletter") ? "default" : "secondary"}>
        {row.getValue("subscribeNewsletter") ? "Yes" : "No"}
      </Badge>
    ),
  },
  
]

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userData = await getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Customers</h1>
            <p className="text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer database ({users.length} total)
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Customer List</CardTitle>
          <CardDescription>
            View and manage customer information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} searchKey="firstName" />
        </CardContent>
      </Card>
    </div>
  )
}