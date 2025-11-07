import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import MessagesInterface from '@/app/components/MessagesInterface'

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get all conversations for the sidebar
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id
        }
      }
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

  // Get the selected conversation with all messages
  const selectedConversation = await prisma.conversation.findUnique({
    where: { id: params.id },
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
        orderBy: { createdAt: 'asc' },
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
    }
  })

  if (!selectedConversation) {
    notFound()
  }

  // Verify user is part of this conversation
  const isParticipant = selectedConversation.participants.some(p => p.userId === session.user.id)
  if (!isParticipant) {
    redirect('/messages')
  }

  // Add fullMessages to the selected conversation for the interface
  const selectedConversationData = {
    ...selectedConversation,
    fullMessages: selectedConversation.messages,
    _count: {
      messages: 0 // Will be calculated
    }
  }

  return (
    <MessagesInterface
      conversations={conversations}
      currentUserId={session.user.id}
      selectedConversationId={params.id}
      selectedConversationData={selectedConversationData}
    />
  )
}
