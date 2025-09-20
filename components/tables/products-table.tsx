"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { EditProductDialog } from "@/components/dialogs/edit-product-dialog"

export interface Product {
  id: string;
  title: string; // Document ID is the title
  brand: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  type: string;
  available_quantity:number;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Product Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return (
        <div className="font-medium max-w-[200px] truncate" title={title}>
          {title}
        </div>
      )
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("type")}</Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "available_quantity",
    header: "Available Quantity",
    cell: ({ row }) => {
      const quantity = row.getValue("available_quantity") as number
      return (
        <div className="font-medium">
          {quantity || 0}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      return (
        <EditProductDialog product={product} />
      )
    },
  },
]

interface ProductsTableProps {
  data: Product[]
}

export function ProductsTable({ data }: ProductsTableProps) {
  return <DataTable columns={columns} data={data} searchKey="title" />
}