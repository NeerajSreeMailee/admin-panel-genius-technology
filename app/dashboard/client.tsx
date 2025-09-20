"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { QuotationDetailModal } from "@/components/quotation-detail-modal"
import { Quotation } from "@/types/firebase"
import { fetchQuotations } from "@/lib/firebase-data"

export function DashboardClient() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const data = await fetchQuotations()
        setQuotations(data)
      } catch (error) {
        console.error("Error fetching quotations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuotations()
  }, [])

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setIsModalOpen(true)
  }

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    // Update the local data to reflect the status change
    setQuotations(prev => prev.map(quotation => 
      quotation.id === id ? { ...quotation, status } : quotation
    ))
    
    // Also update the selected quotation if it's the same one
    if (selectedQuotation && selectedQuotation.id === id) {
      setSelectedQuotation({ ...selectedQuotation, status } as Quotation)
    }
  }

  const recentQuotations = quotations.slice(0, 5)

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading recent quotations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
          <CardDescription>
            Latest quotation requests from customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuotations.length > 0 ? (
              recentQuotations.map((quotation) => (
                <div key={quotation.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {quotation.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {quotation.company} - {quotation.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        quotation.status === 'approved' ? 'default' : 
                        quotation.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {quotation.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(quotation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No quotations found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <QuotationDetailModal 
        quotation={selectedQuotation}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}