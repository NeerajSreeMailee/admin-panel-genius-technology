import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { QuotationsTable } from "@/components/tables"
import { fetchQuotations } from "@/lib/firebase-data"

async function QuotationsContent() {
  const quotations = await fetchQuotations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Requests</CardTitle>
        <CardDescription>
          View and manage customer quotation requests. ({quotations.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {quotations.length > 0 ? (
          <QuotationsTable data={quotations} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No quotations found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage quotation requests
          </p>
        </div>
      </div>

      <Suspense fallback={
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">Loading quotations...</div>
          </CardContent>
        </Card>
      }>
        <QuotationsContent />
      </Suspense>
    </div>
  )
}