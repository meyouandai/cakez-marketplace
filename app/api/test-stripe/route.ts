import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    console.log('=== STRIPE TEST START ===')
    console.log('1. Checking environment variable...')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length)
    console.log('STRIPE_SECRET_KEY starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 10))

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: 'STRIPE_SECRET_KEY not found in environment',
          envVars: Object.keys(process.env).filter(k => k.includes('STRIPE'))
        },
        { status: 500 }
      )
    }

    console.log('2. Initializing Stripe SDK...')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
    console.log('Stripe SDK initialized')

    console.log('3. Creating checkout session...')
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Test Product',
              description: 'Testing Stripe integration',
            },
            unit_amount: 1000, // £10.00
          },
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/test-stripe?success=true`,
      cancel_url: `${request.headers.get('origin')}/test-stripe?canceled=true`,
    })

    console.log('4. Checkout session created:', checkoutSession.id)
    console.log('=== STRIPE TEST SUCCESS ===')

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
      sessionId: checkoutSession.id
    })
  } catch (error: any) {
    console.error('=== STRIPE TEST FAILED ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)

    return NextResponse.json(
      {
        error: error.message,
        type: error.constructor.name,
        code: error.code,
        raw: error.raw?.message || 'No raw message'
      },
      { status: 500 }
    )
  }
}
