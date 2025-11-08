import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  try {
    // Test 1: Capture an exception
    const error = new Error('Sentry API Test Error - This is a test from Cakez Marketplace')
    const errorId = Sentry.captureException(error)

    // Test 2: Capture a message
    const messageId = Sentry.captureMessage('Sentry API Test Message - Hello from API! 👋', 'info')

    return NextResponse.json({
      success: true,
      message: 'Sentry test events sent successfully!',
      errorEventId: errorId,
      messageEventId: messageId,
      instructions: 'Check your Sentry dashboard at https://overflo-digital.sentry.io/issues/'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send test events to Sentry'
    }, { status: 500 })
  }
}
