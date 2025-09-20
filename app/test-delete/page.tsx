"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/lib/firebase-data"
import { toast } from "sonner"

export default function TestDeletePage() {
  const [productId, setProductId] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!productId) {
      toast.error("Please enter a product ID")
      return
    }

    try {
      setIsDeleting(true)
      await deleteProduct(productId)
      toast.success(`Product with ID "${productId}" has been deleted successfully`)
      setProductId("")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Test Delete Functionality</h1>
      <div className="max-w-md">
        <div className="space-y-4">
          <div>
            <label htmlFor="productId" className="block text-sm font-medium mb-1">
              Product ID
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter product ID"
            />
          </div>
          <Button 
            onClick={handleDelete} 
            disabled={isDeleting || !productId}
            variant="destructive"
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      </div>
    </div>
  )
}