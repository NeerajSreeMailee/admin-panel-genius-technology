"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "@/components/tables"
import { fetchProducts } from "@/lib/firebase-data"
import { AddProductDialog } from "@/components/dialogs/add-product-dialog"
import type { Product } from "@/components/tables"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <AddProductDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            A list of all products in your store. ({products.length} products)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <ProductsTable data={products} onDeleteSuccess={loadProducts} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Add your first product to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}