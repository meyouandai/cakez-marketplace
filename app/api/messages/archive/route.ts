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

    const { conversationId, archive } = await request.json()

    if (!conversationId || typeof archive !== 'boolean') {
      return NextResponse.json(
        { error: 'conversationId and archive (boolean) are required' },
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

    // Update archive status
    await prisma.conversationParticipant.update({
      where: {
        id: participant.id
      },
      data: {
        archived: archive,
        archivedAt: archive ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      archived: archive
    })
  } catch (error: any) {
    console.error('Error archiving conversation:', error)
    return NextResponse.json(
      { error: 'Failed to archive conversation' },
      { status: 500 }
    )
  }
}
