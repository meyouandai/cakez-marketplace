import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import MessagesInterface from '@/app/components/MessagesInterface'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
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
