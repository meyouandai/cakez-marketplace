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
  conversations: initialConversations,
  currentUserId,
  selectedConversationId,
  selectedConversationData
}: MessagesInterfaceProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const [conversations, setConversations] = useState(initialConversations)
  const [contextMenu, setContextMenu] = useState<{ conversationId: string; x: number; y: number } | null>(null)

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

  // Real-time polling for conversation updates
  useEffect(() => {
    const pollConversations = async () => {
      try {
        const response = await fetch('/api/messages/conversations')
        if (response.ok) {
          const data = await response.json()
          setConversations(data.conversations)
        }
      } catch (error) {
        console.error('Error polling conversations:', error)
      }
    }

    // Poll every 3 seconds
    const interval = setInterval(pollConversations, 3000)
    return () => clearInterval(interval)
  }, [])

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu])

  const handleArchive = async (conversationId: string) => {
    try {
      const response = await fetch('/api/messages/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, archive: true })
      })

      if (response.ok) {
        // Remove from list immediately (optimistic update)
        setConversations(prev => prev.filter(c => c.id !== conversationId))

        // Navigate and refresh if viewing the archived conversation
        if (selectedConversationId === conversationId) {
          router.push('/messages')
        }

        // Force a refresh to ensure server data is in sync
        router.refresh()
      }
    } catch (error) {
      console.error('Error archiving conversation:', error)
    }
    setContextMenu(null)
  }

  const handleDelete = async (conversationId: string) => {
    if (!confirm('Delete this conversation? You can restore it within 30 days.')) {
      setContextMenu(null)
      return
    }

    try {
      const response = await fetch('/api/messages/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      })

      if (response.ok) {
        // Remove from list immediately (optimistic update)
        setConversations(prev => prev.filter(c => c.id !== conversationId))

        // Navigate and refresh if viewing the deleted conversation
        if (selectedConversationId === conversationId) {
          router.push('/messages')
        }

        // Force a refresh to ensure server data is in sync
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
    setContextMenu(null)
  }

  const handleContextMenu = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault()
    setContextMenu({
      conversationId,
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Conversation List */}
      <div className={`${isMobile ? (showConversationList ? 'w-full' : 'hidden') : 'w-96'} border-r border-gray-200 bg-white flex flex-col`}>
        {/* List Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <Link
              href="/messages/archived"
              className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Archived
            </Link>
          </div>
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
                  <div
                    key={conversation.id}
                    className={`relative group ${isSelected ? 'bg-purple-50 border-l-4 border-cake-purple' : ''}`}
                    onContextMenu={(e) => handleContextMenu(e, conversation.id)}
                  >
                    <button
                      onClick={() => {
                        router.push(`/messages/${conversation.id}`)
                        if (isMobile) {
                          setShowConversationList(false)
                        }
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 transition"
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

                    {/* Action buttons - show on hover or mobile */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContextMenu(e as any, conversation.id)
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                        title="More options"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
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

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`
          }}
        >
          <button
            onClick={() => handleArchive(contextMenu.conversationId)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive
          </button>
          <button
            onClick={() => handleDelete(contextMenu.conversationId)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
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
