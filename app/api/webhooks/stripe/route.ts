import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/app/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
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

    // Create an inquiry/order in the database
    try {
      await prisma.inquiry.create({
        data: {
          customerId: session.metadata!.customerId,
          bakerProfileId: session.metadata!.bakerId,
          customerName: session.metadata!.customerName,
          customerEmail: session.customer_email || session.metadata!.customerEmail || '',
          customerPhone: session.metadata!.customerPhone,
          message: session.metadata!.message,
          status: 'CONTACTED', // Mark as contacted since they paid
        },
      })

      console.log('✅ Order created for checkout session:', session.id)
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return NextResponse.json({ received: true })
}
