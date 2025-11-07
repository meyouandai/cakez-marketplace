'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ConversationView from './ConversationView'

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
  read: boolean
}

interface ConversationData {
  id: string
  participants: {
    userId: string
    user: User
  }[]
  messages: Message[]
  _count: {
    messages: number
  }
  updatedAt: Date
}

interface FullConversation extends ConversationData {
  fullMessages?: Message[]
}

interface MessagesInterfaceProps {
  conversations: ConversationData[]
  currentUserId: string
  selectedConversationId?: string
  selectedConversationData?: FullConversation
}

export default function MessagesInterface({
  conversations,
  currentUserId,
  selectedConversationId,
  selectedConversationData
}: MessagesInterfaceProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // On mobile, hide conversation list when a conversation is selected
    if (isMobile && selectedConversationId) {
      setShowConversationList(false)
    } else if (isMobile && !selectedConversationId) {
      setShowConversationList(true)
    }
  }, [isMobile, selectedConversationId])

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Conversation List */}
      <div className={`${isMobile ? (showConversationList ? 'w-full' : 'hidden') : 'w-96'} border-r border-gray-200 bg-white flex flex-col`}>
        {/* List Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-5xl mb-3">💬</div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-xs text-gray-600 mb-4">Start a conversation by messaging a baker</p>
              <Link
                href="/bakers"
                className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                Find Bakers
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId)
                const otherUser = otherParticipant?.user
                const lastMessage = conversation.messages[0]
                const unreadCount = conversation._count.messages

                if (!otherUser) return null

                const displayName = otherUser.bakerProfile?.businessName || otherUser.email
                const isSelected = conversation.id === selectedConversationId

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      router.push(`/messages/${conversation.id}`)
                      if (isMobile) {
                        setShowConversationList(false)
                      }
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${isSelected ? 'bg-purple-50 border-l-4 border-cake-purple' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                          {lastMessage && (
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                              {new Date(lastMessage.createdAt).toLocaleDateString('en-GB', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {lastMessage ? (
                            <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                              {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                              {lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No messages yet</p>
                          )}

                          {unreadCount > 0 && (
                            <span className="bg-cake-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Conversation View */}
      <div className={`${isMobile ? (showConversationList ? 'hidden' : 'w-full') : 'flex-1'} bg-gray-50 flex flex-col`}>
        {selectedConversationData ? (
          <>
            <ConversationViewWrapper
              conversation={selectedConversationData}
              currentUserId={currentUserId}
              isMobile={isMobile}
              onBack={() => {
                router.push('/messages')
                if (isMobile) {
                  setShowConversationList(true)
                }
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// This wraps the ConversationView component with a header
function ConversationViewWrapper({ conversation, currentUserId, isMobile, onBack }: any) {
  const otherParticipant = conversation.participants.find((p: any) => p.userId !== currentUserId)
  const otherUser = otherParticipant?.user
  const displayName = otherUser?.bakerProfile?.businessName || otherUser?.email

  // Use fullMessages if available, otherwise use messages
  const messages = conversation.fullMessages || conversation.messages || []

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 mr-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="w-10 h-10 bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center text-white font-bold">
            {displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{displayName}</h2>
            <p className="text-xs text-gray-600">
              {otherUser?.role === 'BAKER' && 'Baker'}
              {otherUser?.role === 'ADMIN' && 'Admin'}
              {otherUser?.role === 'CUSTOMER' && 'Customer'}
            </p>
          </div>
        </div>
      </div>

      {/* ConversationView Component */}
      <div className="flex-1 overflow-hidden">
        <ConversationView
          conversationId={conversation.id}
          messages={messages}
          currentUserId={currentUserId}
          otherUserName={displayName}
        />
      </div>
    </div>
  )
}
