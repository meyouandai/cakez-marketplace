import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Get all conversations for this user
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
              email: true
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">Start a conversation by messaging a baker from their profile</p>
          <Link
            href="/bakers"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Find Bakers
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.userId !== session.user.id)
            const otherUser = otherParticipant?.user
            const lastMessage = conversation.messages[0]
            const unreadCount = conversation._count.messages

            if (!otherUser) return null

            const displayName = otherUser.bakerProfile?.businessName || otherUser.email

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block hover:bg-gray-50 transition p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{displayName}</h3>
                          {otherUser.role === 'BAKER' && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                              Baker
                            </span>
                          )}
                          {otherUser.role === 'ADMIN' && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className={`text-sm ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                            {lastMessage.senderId === session.user.id ? 'You: ' : ''}
                            {lastMessage.content.substring(0, 60)}
                            {lastMessage.content.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.createdAt).toLocaleDateString('en-GB', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    {unreadCount > 0 && (
                      <span className="bg-cake-pink text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
