import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import ConversationView from '@/app/components/ConversationView'

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const conversation = await prisma.conversation.findUnique({
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

  if (!conversation) {
    notFound()
  }

  // Verify user is part of this conversation
  const isParticipant = conversation.participants.some(p => p.userId === session.user.id)
  if (!isParticipant) {
    redirect('/messages')
  }

  // Get the other participant
  const otherParticipant = conversation.participants.find(p => p.userId !== session.user.id)
  const otherUser = otherParticipant?.user

  if (!otherUser) {
    return <div>Error: Invalid conversation</div>
  }

  const displayName = otherUser.bakerProfile?.businessName || otherUser.email

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow p-4 mb-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/messages"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="w-10 h-10 bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center text-white font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{displayName}</h2>
              <p className="text-xs text-gray-600">
                {otherUser.role === 'BAKER' && 'Baker'}
                {otherUser.role === 'ADMIN' && 'Admin'}
                {otherUser.role === 'CUSTOMER' && 'Customer'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <ConversationView
        conversationId={conversation.id}
        messages={conversation.messages}
        currentUserId={session.user.id}
        otherUserName={displayName}
      />
    </div>
  )
}
