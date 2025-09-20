import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, message, quotationId, status } = body

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      // Fallback to simulation mode if SMTP is not configured
      console.log('Email simulation mode - SMTP credentials not found:', {
        to,
        subject,
        message,
        quotationId,
        status
      })

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return NextResponse.json({ 
        success: true, 
        message: `Email notification sent for quotation ${quotationId} (${status})`,
        simulated: true
      })
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify transporter configuration
    await transporter.verify()

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: message,
    })

    return NextResponse.json({ 
      success: true, 
      message: `Email notification sent for quotation ${quotationId} (${status})` 
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email notification',
        details: error.message
      },
      { status: 500 }
    )
  }
}