import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { conversationId, status } = body

    if (!conversationId || !status) {
      return NextResponse.json(
        { error: 'Conversation ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be OPEN, IN_PROGRESS, or RESOLVED' },
        { status: 400 }
      )
    }

    // Update conversation status
    const conversation = await prisma.conversation.update({
      where: {
        id: conversationId,
        type: 'SUPPORT'
      },
      data: {
        status: status
      }
    })

    return NextResponse.json({
      success: true,
      conversation
    })
  } catch (error: any) {
    console.error('Error updating ticket status:', error)
    return NextResponse.json(
      { error: 'Failed to update status', details: error.message },
      { status: 500 }
    )
  }
}
