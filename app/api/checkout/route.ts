import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import Stripe from 'stripe'
import prisma from '@/app/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

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
    const { cakeId, customerName, customerEmail, customerPhone, message } = body

    // Get cake details
    const cake = await prisma.cakeListing.findUnique({
      where: { id: cakeId },
      include: {
        baker: {
          select: {
            id: true,
            businessName: true
          }
        }
      }
    })

    if (!cake) {
      return NextResponse.json(
        { error: 'Cake not found' },
        { status: 404 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: cake.title,
              description: `From ${cake.baker.businessName}`,
              images: cake.images.filter(img => img.startsWith('http')).slice(0, 1), // Only use external URLs for Stripe
            },
            unit_amount: Math.round(cake.price * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || request.headers.get('origin')}/cakes/${cakeId}`,
      customer_email: customerEmail,
      metadata: {
        cakeId: cake.id,
        bakerId: cake.baker.id,
        customerId: session.user.id,
        customerName,
        customerPhone: customerPhone || '',
        message,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
