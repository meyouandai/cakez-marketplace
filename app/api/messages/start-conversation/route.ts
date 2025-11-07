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
    const { recipientId, initialMessage } = await request.json()

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      )
    }

    // Check if conversation already exists between these two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [session.user.id, recipientId]
            }
          }
        }
      },
      include: {
        participants: true
      }
    })

    // If conversation exists with exactly 2 participants (both users), return it
    if (existingConversation && existingConversation.participants.length === 2) {
      const participantIds = existingConversation.participants.map(p => p.userId)
      if (participantIds.includes(session.user.id) && participantIds.includes(recipientId)) {
        return NextResponse.json({ conversationId: existingConversation.id })
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: session.user.id },
            { userId: recipientId }
          ]
        },
        messages: initialMessage ? {
          create: {
            senderId: session.user.id,
            content: initialMessage
          }
        } : undefined
      }
    })

    return NextResponse.json({ conversationId: conversation.id })
  } catch (error) {
    console.error('Error starting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to start conversation' },
      { status: 500 }
    )
  }
}
