import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.FROM_EMAIL

    console.log('Testing Resend configuration...')
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length || 0)
    console.log('FROM_EMAIL:', fromEmail)

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured',
        config: {
          apiKeyExists: false,
          fromEmail: fromEmail || 'not set'
        }
      }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    // Try to send a test email
    const result = await resend.emails.send({
      from: fromEmail || 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend's test email that always accepts
      subject: 'Test Email from Cakez Marketplace',
      html: '<p>This is a test email to verify Resend is working correctly.</p>'
    })

    console.log('Resend API response:', result)

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error.message,
        details: result.error,
        config: {
          apiKeyExists: !!apiKey,
          apiKeyLength: apiKey.length,
          fromEmail: fromEmail
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: result.data?.id,
      config: {
        apiKeyExists: !!apiKey,
        apiKeyLength: apiKey.length,
        fromEmail: fromEmail
      }
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack,
      config: {
        apiKeyExists: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL
      }
    }, { status: 500 })
  }
}
