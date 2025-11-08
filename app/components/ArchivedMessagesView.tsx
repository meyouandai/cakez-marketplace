'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
  bakerProfile?: {
    businessName: string
  } | null
}

interface Message {
  id: string
  content: string
  createdAt: Date
  senderId: string
  sender: User
}

interface Conversation {
  id: string
  participants: {
    userId: string
    user: User
    archived: boolean
    archivedAt: Date | null
  }[]
  messages: Message[]
  updatedAt: Date
}

interface ArchivedMessagesViewProps {
  conversations: Conversation[]
  currentUserId: string
}

export default function ArchivedMessagesView({ conversations: initialConversations, currentUserId }: ArchivedMessagesViewProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState(initialConversations)

  const handleUnarchive = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking unarchive

    try {
      const response = await fetch('/api/messages/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, archive: false })
      })

      if (response.ok) {
        // Remove from archived list immediately
        setConversations(prev => prev.filter(c => c.id !== conversationId))
      }
    } catch (error) {
      console.error('Error unarchiving conversation:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/messages" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Messages
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Archived Conversations</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No archived conversations</h3>
          <p className="text-gray-600 mb-6">Conversations you archive will appear here</p>
          <Link
            href="/messages"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Go to Messages
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId)
            const otherUser = otherParticipant?.user
            const lastMessage = conversation.messages[0]
            const userParticipant = conversation.participants.find(p => p.userId === currentUserId)

            if (!otherUser) return null

            const displayName = otherUser.bakerProfile?.businessName || otherUser.email

            return (
              <div
                key={conversation.id}
                className="p-6 flex items-start justify-between hover:bg-gray-50 transition cursor-pointer"
                onClick={() => router.push(`/messages/${conversation.id}`)}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{displayName}</h3>
                      {otherUser.role === 'BAKER' && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                          Baker
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archived {userParticipant?.archivedAt ? new Date(userParticipant.archivedAt).toLocaleDateString('en-GB') : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleUnarchive(conversation.id, e)}
                  className="ml-4 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 border border-purple-600 hover:border-purple-800 rounded-lg transition flex-shrink-0"
                >
                  Unarchive
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
