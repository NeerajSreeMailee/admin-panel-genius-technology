"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

export interface Quotation {
  id: string;
  budget: string;
  company: string;
  createdAt: Date;
  email: string;
  fullName: string;
  message: string;
  phone: string;
  products: string;
  status: 'pending' | 'processed' | 'completed';
}

const columns: ColumnDef<Quotation>[] = [
  {
    accessorKey: "id",
    header: "Inquiry ID",
  },
  {
    accessorKey: "fullName",
    header: "Customer Name",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as string
      return (
        <div className="max-w-[150px] truncate" title={products}>
          {products}
        </div>
      )
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === 'completed' ? 'default' : 
            status === 'processed' ? 'secondary' : 
            'destructive'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <div>{new Date(date).toLocaleDateString()}</div>
    },
  },
]

interface QuotationsTableProps {
  data: Quotation[]
}

export function QuotationsTable({ data }: QuotationsTableProps) {
  return <DataTable columns={columns} data={data} searchKey="fullName" />
}