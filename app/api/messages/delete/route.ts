import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await request.json()

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    // Verify user is a participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: session.user.id
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check if conversation is already deleted
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (conversation?.deletedAt) {
      return NextResponse.json(
        { error: 'Conversation already deleted' },
        { status: 400 }
      )
    }

    // Soft delete the conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        deletedAt: new Date(),
        deletedBy: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      deletedAt: new Date(),
      message: 'Conversation deleted. Can be restored within 30 days.'
    })
  } catch (error: any) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}
