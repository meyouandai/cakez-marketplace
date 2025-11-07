import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Fetch session from Stripe to get metadata
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    )

    if (!stripeResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Stripe session' },
        { status: 500 }
      )
    }

    const stripeSession = await stripeResponse.json()

    // Check if order already exists
    const existingOrder = await prisma.inquiry.findFirst({
      where: {
        customerId: stripeSession.metadata.customerId,
        bakerProfileId: stripeSession.metadata.bakerId,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
        }
      }
    })

    if (existingOrder) {
      return NextResponse.json({ success: true, existing: true })
    }

    // Create the order
    const order = await prisma.inquiry.create({
      data: {
        customerId: stripeSession.metadata.customerId,
        bakerProfileId: stripeSession.metadata.bakerId,
        customerName: stripeSession.metadata.customerName,
        customerEmail: stripeSession.customer_email || stripeSession.metadata.customerEmail || '',
        customerPhone: stripeSession.metadata.customerPhone,
        message: stripeSession.metadata.message,
        status: 'CONTACTED',
      },
    })

    console.log('✅ Order created:', order.id)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    console.error('Error completing order:', error)
    return NextResponse.json(
      { error: 'Failed to complete order', details: error.message },
      { status: 500 }
    )
  }
}
