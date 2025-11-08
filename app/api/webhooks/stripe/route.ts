import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/app/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    // In production, you'd verify the webhook signature
    // For now in test mode, we'll just parse the event
    event = JSON.parse(body) as Stripe.Event
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Check if this is a course enrollment
      if (session.metadata?.type === 'course_enrollment') {
        const courseId = session.metadata.courseId
        const userId = session.metadata.userId

        // Create course enrollment
        await prisma.courseEnrollment.create({
          data: {
            userId,
            courseId,
            progress: 0
          }
        })

        console.log('✅ Course enrollment created for session:', session.id)
      }
      // Note: Cake orders are handled by /api/complete-order route which creates Order records
    } catch (error) {
      console.error('Error processing checkout session:', error)
    }
  }

  return NextResponse.json({ received: true })
}
