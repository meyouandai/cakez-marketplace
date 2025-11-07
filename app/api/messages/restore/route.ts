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

    // Check if conversation is deleted and within 30-day window
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation?.deletedAt) {
      return NextResponse.json(
        { error: 'Conversation is not deleted' },
        { status: 400 }
      )
    }

    // Check if within 30-day recovery window
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (conversation.deletedAt < thirtyDaysAgo) {
      return NextResponse.json(
        { error: 'Recovery period expired (30 days)' },
        { status: 400 }
      )
    }

    // Restore the conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        deletedAt: null,
        deletedBy: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Conversation restored successfully'
    })
  } catch (error: any) {
    console.error('Error restoring conversation:', error)
    return NextResponse.json(
      { error: 'Failed to restore conversation' },
      { status: 500 }
    )
  }
}
