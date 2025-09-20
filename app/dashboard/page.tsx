import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText, ShoppingCart, Package } from "lucide-react"
import { fetchDashboardStats, fetchRecentOrders } from "@/lib/firebase-data"
import { SalesChart, RevenueTrendChart, OrderStatusChart } from "@/components/dashboard-charts"
import { DashboardClient } from "./client"

async function DashboardStats() {
  console.log("DashboardStats component loading");
  const stats = await fetchDashboardStats()
  console.log("Dashboard stats fetched", stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Products in inventory
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingOrders} pending, {stats.completedOrders} completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted-foreground">
            From {stats.totalOrders} orders
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quotations</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuotations}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingQuotations} pending requests
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

async function RecentOrders() {
  console.log("RecentOrders component loading");
  const recentOrders = await fetchRecentOrders(5)
  console.log("Orders fetched", recentOrders.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest customer orders and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.orderId} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Order #{order.orderId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerEmail} • {order.itemCount} items • ₹{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Badge 
                    variant={
                      order.status === 'delivered' ? 'default' : 
                      order.status === 'shipped' ? 'secondary' : 
                      order.status === 'processing' ? 'outline' :
                      'destructive'
                    }
                  >
                    {order.status}
                  </Badge>
                  <Badge 
                    variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No orders found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  console.log("DashboardPage component rendered");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">Loading...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <DashboardStats />
      </Suspense>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <SalesChart />
        <RevenueTrendChart />
        <OrderStatusChart />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">Loading recent orders...</div>
            </CardContent>
          </Card>
        }>
          <RecentOrders />
        </Suspense>

        <Suspense fallback={
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">Loading recent quotations...</div>
            </CardContent>
          </Card>
        }>
          <DashboardClient />
        </Suspense>
      </div>
    </div>
  )
}