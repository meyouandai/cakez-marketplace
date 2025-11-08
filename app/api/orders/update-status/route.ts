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
    const { orderId, status, deliveryDate, deliveryAddress } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get baker profile
    const bakerProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!bakerProfile) {
      return NextResponse.json(
        { error: 'Baker profile not found' },
        { status: 404 }
      )
    }

    // Verify this order belongs to the baker
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.bakerId !== bakerProfile.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this order' },
        { status: 403 }
      )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
        ...(deliveryAddress && { deliveryAddress })
      }
    })

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
