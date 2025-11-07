import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { title, description, location, urgency, budget, daysValid } = await request.json()

    if (!title || !description || !location || !urgency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
        { status: 400 }
      )
    }

    if (!['flexible', 'medium', 'urgent'].includes(urgency)) {
      return NextResponse.json(
        { error: 'Invalid urgency level' },
        { status: 400 }
      )
    }

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (daysValid || 7))

    // Create buyer request
    const buyerRequest = await prisma.buyerRequest.create({
      data: {
        customerId: session.user.id,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        urgency,
        budget: budget ? parseFloat(budget) : null,
        expiresAt
      }
    })

    return NextResponse.json({ success: true, request: buyerRequest })
  } catch (error) {
    console.error('Error creating buyer request:', error)
    return NextResponse.json(
      { error: 'Failed to create buyer request' },
      { status: 500 }
    )
  }
}
