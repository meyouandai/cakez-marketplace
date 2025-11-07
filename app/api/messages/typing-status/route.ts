import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

// In-memory store for typing statuses
// Format: { conversationId: { userId: { isTyping: boolean, timestamp: number } } }
const typingStatuses = new Map<string, Map<string, { isTyping: boolean; timestamp: number }>>()

// Clean up old typing statuses (older than 5 seconds)
setInterval(() => {
  const now = Date.now()
  for (const [conversationId, users] of typingStatuses.entries()) {
    for (const [userId, status] of users.entries()) {
      if (now - status.timestamp > 5000) {
        users.delete(userId)
      }
    }
    if (users.size === 0) {
      typingStatuses.delete(conversationId)
    }
  }
}, 5000)

// POST - Set typing status
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { conversationId, isTyping } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Get or create conversation typing statuses
    if (!typingStatuses.has(conversationId)) {
      typingStatuses.set(conversationId, new Map())
    }

    const conversationTyping = typingStatuses.get(conversationId)!

    if (isTyping) {
      conversationTyping.set(session.user.id, {
        isTyping: true,
        timestamp: Date.now()
      })
    } else {
      conversationTyping.delete(session.user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error setting typing status:', error)
    return NextResponse.json(
      { error: 'Failed to set typing status', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Get typing status for conversation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const conversationTyping = typingStatuses.get(conversationId)

    if (!conversationTyping) {
      return NextResponse.json({ isTyping: false })
    }

    // Find if anyone else is typing (exclude current user)
    for (const [userId, status] of conversationTyping.entries()) {
      if (userId !== session.user.id && status.isTyping) {
        // Check if status is recent (within last 5 seconds)
        if (Date.now() - status.timestamp < 5000) {
          return NextResponse.json({ isTyping: true, userId })
        }
      }
    }

    return NextResponse.json({ isTyping: false })
  } catch (error: any) {
    console.error('Error getting typing status:', error)
    return NextResponse.json(
      { error: 'Failed to get typing status', details: error.message },
      { status: 500 }
    )
  }
}
