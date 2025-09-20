"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

export interface PaymentSummary {
  orderId: string;
  paymentId: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  fee: number;
  tax: number;
  createdAt: Date;
  razorpayOrderId: string;
  paymentTransactionId: string;
}

const columns: ColumnDef<PaymentSummary>[] = [
  {
    accessorKey: "paymentId",
    header: "Payment ID",
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string
      return <Badge variant="outline">{method}</Badge>
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return (
        <Badge 
          variant={
            status === 'paid' || status === 'success' ? 'default' : 
            status === 'pending' ? 'secondary' : 
            'destructive'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = row.original.currency
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = parseFloat(row.getValue("fee"))
      const currency = row.original.currency
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
      }).format(fee)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "tax",
    header: "Tax",
    cell: ({ row }) => {
      const tax = parseFloat(row.getValue("tax"))
      const currency = row.original.currency
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency || "INR",
      }).format(tax)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "paymentTransactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const txnId = row.getValue("paymentTransactionId") as string
      return (
        <div className="max-w-[120px] truncate font-mono text-sm" title={txnId}>
          {txnId}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return <div>{new Date(date).toLocaleDateString()}</div>
    },
  },
]

interface PaymentsTableProps {
  data: PaymentSummary[]
}

export function PaymentsTable({ data }: PaymentsTableProps) {
  return <DataTable columns={columns} data={data} searchKey="paymentId" />
}