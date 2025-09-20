import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { OrdersTable } from "@/components/tables"
import { fetchOrders } from "@/lib/firebase-data"

async function OrdersContent() {
  const orders = await fetchOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>
          View and process customer orders. ({orders.length} orders)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <OrdersTable data={orders} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No orders found. Orders will appear here when customers make purchases.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <Suspense fallback={
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading orders...</div>
          </CardContent>
        </Card>
      }>
        <OrdersContent />
      </Suspense>
    </div>
  )
}