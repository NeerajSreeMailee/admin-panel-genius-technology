"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Quotation } from "@/types/firebase"
import { QuotationDetailModal } from "@/components/quotation-detail-modal"

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
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 
            'secondary'
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
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quotations, setQuotations] = useState<Quotation[]>(data)

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setIsModalOpen(true)
  }

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    // Update the local data to reflect the status change
    setQuotations(prev => prev.map(quotation => 
      quotation.id === id ? { ...quotation, status } : quotation
    ))
    
    // Also update the selected quotation if it's the same one
    if (selectedQuotation && selectedQuotation.id === id) {
      setSelectedQuotation({ ...selectedQuotation, status })
    }
  }

  // Add the action column to the columns array
  const columnsWithActions: ColumnDef<Quotation>[] = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quotation = row.original
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewDetails(quotation)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <DataTable columns={columnsWithActions} data={quotations} searchKey="fullName" />
      <QuotationDetailModal 
        quotation={selectedQuotation}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}