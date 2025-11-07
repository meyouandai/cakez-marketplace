import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API called')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }

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

    // Create Stripe checkout session using direct API call
    const successUrl = `${process.env.NEXTAUTH_URL || request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${process.env.NEXTAUTH_URL || request.headers.get('origin')}/cakes/${cakeId}`

    const formData = new URLSearchParams({
      'mode': 'payment',
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'gbp',
      'line_items[0][price_data][product_data][name]': cake.title,
      'line_items[0][price_data][product_data][description]': `From ${cake.baker.businessName}`,
      'line_items[0][price_data][unit_amount]': Math.round(cake.price * 100).toString(),
      'line_items[0][quantity]': '1',
      'success_url': successUrl,
      'cancel_url': cancelUrl,
      'customer_email': customerEmail,
      'metadata[cakeId]': cake.id,
      'metadata[bakerId]': cake.baker.id,
      'metadata[customerId]': session.user.id,
      'metadata[customerName]': customerName,
      'metadata[customerPhone]': customerPhone || '',
      'metadata[message]': message,
    })

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const data = await stripeResponse.json()

    if (!stripeResponse.ok) {
      console.error('Stripe API error:', data)
      return NextResponse.json(
        { error: 'Failed to create checkout session', details: data.error?.message || 'Unknown error' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: data.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
