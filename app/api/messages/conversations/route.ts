import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const onlyDeleted = searchParams.get('onlyDeleted') === 'true'

    // Build the query
    const whereClause: any = {
      participants: {
        some: {
          userId: session.user.id,
          ...(includeArchived ? {} : { archived: false })
        }
      }
    }

    // If onlyDeleted, show only soft-deleted conversations
    if (onlyDeleted) {
      whereClause.deletedAt = { not: null }
      // Check if still within 30-day recovery window
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      whereClause.deletedAt = { gte: thirtyDaysAgo }
    } else {
      // Otherwise, exclude deleted conversations
      whereClause.deletedAt = null
    }

    // Get all conversations for this user
    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                bakerProfile: {
                  select: {
                    businessName: true
                  }
                }
              }
            }
          }
        },
        messages: {
          where: {
            deletedAt: null // Exclude soft-deleted messages
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                bakerProfile: {
                  select: {
                    businessName: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: session.user.id },
                read: false,
                deletedAt: null // Don't count deleted messages
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Add archived status for each conversation
    const conversationsWithStatus = conversations.map(conv => {
      const userParticipant = conv.participants.find(p => p.userId === session.user.id)
      return {
        ...conv,
        isArchived: userParticipant?.archived || false,
        archivedAt: userParticipant?.archivedAt || null
      }
    })

    return NextResponse.json({
      conversations: conversationsWithStatus,
      count: conversationsWithStatus.length
    })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
