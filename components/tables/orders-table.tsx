"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

export interface OrderSummary {
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  createdAt: Date;
  itemCount: number;
}

const columns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
  },
  {
    accessorKey: "customerPhone",
    header: "Phone",
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: ({ row }) => {
      const count = row.getValue("itemCount") as number
      return <Badge variant="outline">{count} items</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          variant={
            status === 'delivered' ? 'default' : 
            status === 'shipped' ? 'secondary' : 
            status === 'processing' ? 'outline' :
            'destructive'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return (
        <Badge 
          variant={status === 'paid' ? 'default' : 'destructive'}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("subtotal"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <div>{new Date(date).toLocaleDateString()}</div>
    },
  },
]

interface OrdersTableProps {
  data: OrderSummary[]
}

export function OrdersTable({ data }: OrdersTableProps) {
  return <DataTable columns={columns} data={data} searchKey="orderId" />
}