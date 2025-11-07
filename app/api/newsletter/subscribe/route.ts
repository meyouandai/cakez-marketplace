import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { id: existing.id },
          data: { active: true }
        })

        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated!'
        })
      }
    }

    // Create new subscription
    // If user is logged in, link to their account
    const subscriptionData: any = {
      email: email.toLowerCase(),
      active: true
    }

    if (session) {
      subscriptionData.userId = session.user.id
    }

    await prisma.newsletterSubscription.create({
      data: subscriptionData
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)

    // Check if it's a unique constraint violation (user already has subscription)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You are already subscribed with your account' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to subscribe', details: error.message },
      { status: 500 }
    )
  }
}
