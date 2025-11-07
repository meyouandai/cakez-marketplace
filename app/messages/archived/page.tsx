import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ArchivedMessagesView from '@/app/components/ArchivedMessagesView'

export default async function ArchivedMessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get archived conversations for this user
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
          archived: true
        }
      },
      deletedAt: null // Don't show deleted conversations in archive
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
        where: {
          deletedAt: null
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
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // Filter to only show conversations where current user has archived
  const archivedConversations = conversations.filter(conv => {
    const userParticipant = conv.participants.find(p => p.userId === session.user.id)
    return userParticipant?.archived === true
  })

  return (
    <ArchivedMessagesView
      conversations={archivedConversations}
      currentUserId={session.user.id}
    />
  )
}
