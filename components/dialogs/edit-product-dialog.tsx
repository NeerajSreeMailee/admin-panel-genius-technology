"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditProductForm } from "@/components/forms/edit-product-form"
import type { Product } from "@/components/tables"

interface EditProductDialogProps {
  product: Product
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information for {product.title}
          </DialogDescription>
        </DialogHeader>
        <EditProductForm 
          product={product} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </DialogContent>
    </Dialog>
  )
}