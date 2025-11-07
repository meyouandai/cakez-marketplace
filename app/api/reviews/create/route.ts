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
    const { orderId, rating, comment, photos } = await request.json()

    if (!orderId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Verify the order exists and belongs to the customer
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { review: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.customerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to review this order' },
        { status: 403 }
      )
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only review completed orders' },
        { status: 400 }
      )
    }

    if (order.review) {
      return NextResponse.json(
        { error: 'You have already reviewed this order' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        orderId,
        userId: session.user.id,
        rating: parseInt(rating),
        comment: comment.trim(),
        photos: photos || []
      }
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
