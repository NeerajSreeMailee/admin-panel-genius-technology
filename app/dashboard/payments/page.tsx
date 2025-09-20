import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { PaymentsTable } from "@/components/tables"
import { fetchPayments } from "@/lib/firebase-data"

async function PaymentsContent() {
  const payments = await fetchPayments()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          View all payment transactions and their status. ({payments.length} payments)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <PaymentsTable data={payments} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No payments found. Payment transactions will appear here.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track payments and transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Payments
        </Button>
      </div>

      <Suspense fallback={
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading payments...</div>
          </CardContent>
        </Card>
      }>
        <PaymentsContent />
      </Suspense>
    </div>
  )
}