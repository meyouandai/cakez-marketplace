import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DIRECT STRIPE API TEST ===')
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY not configured' },
        { status: 500 }
      )
    }

    // Make direct HTTP request to Stripe API
    console.log('Making direct API call to Stripe...')
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'gbp',
        'line_items[0][price_data][product_data][name]': 'Test Product',
        'line_items[0][price_data][unit_amount]': '1000',
        'line_items[0][quantity]': '1',
        'success_url': `${request.headers.get('origin')}/test-stripe?success=true`,
        'cancel_url': `${request.headers.get('origin')}/test-stripe?canceled=true`,
      }).toString(),
    })

    console.log('Stripe API response status:', response.status)
    const data = await response.json()
    console.log('Stripe API response:', data)

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Stripe API error',
          status: response.status,
          response: data
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      sessionId: data.id
    })
  } catch (error: any) {
    console.error('=== DIRECT API TEST FAILED ===')
    console.error('Error:', error.message)

    return NextResponse.json(
      {
        error: error.message,
        type: error.constructor.name,
      },
      { status: 500 }
    )
  }
}
