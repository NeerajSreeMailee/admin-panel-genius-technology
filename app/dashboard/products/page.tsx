import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductsTable } from "@/components/tables"
import { fetchProducts } from "@/lib/firebase-data"
import { AddProductDialog } from "@/components/dialogs/add-product-dialog"

async function ProductsContent() {
  const products = await fetchProducts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product List</CardTitle>
        <CardDescription>
          A list of all products in your store. ({products.length} products)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ProductsTable data={products} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No products found. Add your first product to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
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

      <Suspense fallback={
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading products...</div>
          </CardContent>
        </Card>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  )
}