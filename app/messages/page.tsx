import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import MessagesInterface from '@/app/components/MessagesInterface'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { userId?: string; orderId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Handle starting a conversation from URL parameters
  if (searchParams.userId) {
    const recipientId = searchParams.userId

    // Check if conversation already exists
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

    // If conversation exists with exactly 2 participants (both users), redirect to it
    if (existingConversation && existingConversation.participants.length === 2) {
      const participantIds = existingConversation.participants.map(p => p.userId)
      if (participantIds.includes(session.user.id) && participantIds.includes(recipientId)) {
        redirect(`/messages/${existingConversation.id}`)
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
        }
      }
    })

    redirect(`/messages/${conversation.id}`)
  }

  // Get all conversations for this user (exclude archived and deleted)
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
          archived: false
        }
      },
      deletedAt: null
    },
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
              read: false
            }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <MessagesInterface
      conversations={conversations}
      currentUserId={session.user.id}
    />
  )
}
