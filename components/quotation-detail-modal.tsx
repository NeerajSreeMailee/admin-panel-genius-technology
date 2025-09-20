"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Quotation } from "@/types/firebase"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface QuotationDetailModalProps {
  quotation: Quotation | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void
}

export function QuotationDetailModal({ quotation, open, onClose, onStatusChange }: QuotationDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  if (!quotation) return null

  const sendEmailNotification = async (status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: quotation.email,
          subject: `Quotation ${status === 'approved' ? 'Approved' : 'Rejected'} - Genius Technology`,
          message: `Dear ${quotation.fullName},
          
Your quotation request has been ${status === 'approved' ? 'approved' : 'rejected'}.
          
${status === 'approved' 
  ? 'We are pleased to inform you that your quotation has been approved. Our team will contact you shortly to discuss the next steps.' 
  : `We regret to inform you that your quotation has been rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : 'Please contact us for more information.'}`}

Quotation ID: ${quotation.id}
Company: ${quotation.company}
Products: ${quotation.products}
Budget: ${quotation.budget}

Thank you for choosing Genius Technology.

Best regards,
Genius Technology Team`,
          quotationId: quotation.id,
          status
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        if (result.simulated) {
          toast.success(`Email notification simulated for ${quotation.email} (SMTP not configured)`)
        } else {
          toast.success(`Email notification sent to ${quotation.email}`)
        }
      } else {
        toast.error('Failed to send email notification')
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send email notification")
    }
  }

  const handleStatusChange = async (status: 'approved' | 'rejected') => {
    setLoading(true)
    try {
      // Update quotation status in Firestore
      const quotationRef = doc(db, 'quotation', quotation.id)
      await updateDoc(quotationRef, {
        status,
        ...(status === 'rejected' && { rejectionReason })
      })

      // Send email notification
      await sendEmailNotification(status)

      // Notify parent component
      onStatusChange(quotation.id, status)

      // Show success message
      toast.success(`Quotation ${status === 'approved' ? 'approved' : 'rejected'} successfully`)

      // Close modal
      onClose()

      // Reset rejection reason
      setRejectionReason("")
    } catch (error) {
      console.error("Error updating quotation status:", error)
      toast.error("Failed to update quotation status")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | any) => {
    // Handle both Firebase Timestamp and Date objects
    let formattedDate: Date;
    
    if (date instanceof Date) {
      formattedDate = date;
    } else if (date && typeof date.toDate === 'function') {
      formattedDate = date.toDate();
    } else {
      formattedDate = new Date(date);
    }
    
    return formattedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quotation Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Full Name</Label>
              <div className="mt-1 text-sm">{quotation.fullName}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Company</Label>
              <div className="mt-1 text-sm">{quotation.company}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <div className="mt-1 text-sm">{quotation.email}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <div className="mt-1 text-sm">{quotation.phone}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Budget</Label>
              <div className="mt-1 text-sm">{quotation.budget}</div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                <Badge 
                  variant={
                    quotation.status === 'approved' ? 'default' : 
                    quotation.status === 'rejected' ? 'destructive' : 
                    'secondary'
                  }
                >
                  {quotation.status}
                </Badge>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Created At</Label>
              <div className="mt-1 text-sm">{formatDate(quotation.createdAt)}</div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Products</Label>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm">
              {quotation.products}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Message</Label>
            <div className="mt-1 p-3 bg-muted rounded-md text-sm">
              {quotation.message || "No message provided"}
            </div>
          </div>
          
          {quotation.status === 'rejected' && quotation.rejectionReason && (
            <div>
              <Label className="text-sm font-medium">Rejection Reason</Label>
              <div className="mt-1 p-3 bg-destructive/10 rounded-md text-sm">
                {quotation.rejectionReason}
              </div>
            </div>
          )}
          
          {quotation.status === 'pending' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejectionReason" className="text-sm font-medium">
                  Rejection Reason (Optional)
                </Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={() => handleStatusChange('approved')}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Accept"}
                </Button>
              </div>
            </div>
          )}
          
          {quotation.status !== 'pending' && (
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}