import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'BAKER') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { requestId, bakerId, message, proposedPrice, deliveryTime } = await request.json()

    if (!requestId || !bakerId || !message || !proposedPrice || !deliveryTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (message.length < 50) {
      return NextResponse.json(
        { error: 'Message must be at least 50 characters' },
        { status: 400 }
      )
    }

    const price = parseFloat(proposedPrice)
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    // Verify baker profile belongs to user
    const bakerProfile = await prisma.bakerProfile.findUnique({
      where: { id: bakerId }
    })

    if (!bakerProfile || bakerProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid baker profile' },
        { status: 403 }
      )
    }

    // Check if request exists and is not expired
    const buyerRequest = await prisma.buyerRequest.findUnique({
      where: { id: requestId }
    })

    if (!buyerRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (buyerRequest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This request has expired' },
        { status: 400 }
      )
    }

    // Check if baker has already responded
    const existingResponse = await prisma.bakerResponse.findFirst({
      where: {
        requestId,
        bakerId
      }
    })

    if (existingResponse) {
      return NextResponse.json(
        { error: 'You have already responded to this request' },
        { status: 400 }
      )
    }

    // Create response
    const response = await prisma.bakerResponse.create({
      data: {
        requestId,
        bakerId,
        message: message.trim(),
        proposedPrice: price,
        deliveryTime: deliveryTime.trim()
      }
    })

    return NextResponse.json({ success: true, response })
  } catch (error) {
    console.error('Error creating baker response:', error)
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}
