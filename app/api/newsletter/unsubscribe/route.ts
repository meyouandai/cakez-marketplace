import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find and deactivate subscription
    const subscription = await prisma.newsletterSubscription.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      )
    }

    await prisma.newsletterSubscription.update({
      where: { id: subscription.id },
      data: { active: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    })
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe', details: error.message },
      { status: 500 }
    )
  }
}
