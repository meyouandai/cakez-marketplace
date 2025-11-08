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
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId
      }
    })

    if (existingOrder) {
      return NextResponse.json({ success: true, existing: true })
    }

    // Create the order using the new Order model
    const order = await prisma.order.create({
      data: {
        customerId: stripeSession.metadata.customerId,
        bakerId: stripeSession.metadata.bakerId,
        cakeId: stripeSession.metadata.cakeId,
        status: 'PENDING',
        totalAmount: stripeSession.amount_total! / 100, // Convert from cents
        stripeSessionId: sessionId,
        specialRequests: stripeSession.metadata.message,
        // deliveryDate and deliveryAddress can be added later by baker/customer
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
