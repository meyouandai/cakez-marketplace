'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  content: string
  createdAt: Date
  senderId: string
  sender: {
    id: string
    email: string
    role: string
    bakerProfile?: {
      businessName: string
    } | null
  }
}

interface ConversationViewProps {
  conversationId: string
  messages: Message[]
  currentUserId: string
  otherUserName: string
}

export default function ConversationView({ conversationId, messages: initialMessages, currentUserId, otherUserName }: ConversationViewProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, otherUserTyping])

  useEffect(() => {
    // Mark messages as read when viewing
    fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId })
    })

    // Poll for new messages and typing status every 2 seconds
    const interval = setInterval(async () => {
      // Check typing status
      try {
        const response = await fetch(`/api/messages/typing-status?conversationId=${conversationId}`)
        if (response.ok) {
          const data = await response.json()
          setOtherUserTyping(data.isTyping && data.userId !== currentUserId)
        }
      } catch (err) {
        // Silently fail - typing status is not critical
      }

      // Fetch new messages
      try {
        // Get timestamp of last message
        const lastMessageTime = messages.length > 0
          ? new Date(messages[messages.length - 1].createdAt).toISOString()
          : new Date(0).toISOString()

        const response = await fetch(`/api/messages/fetch?conversationId=${conversationId}&since=${encodeURIComponent(lastMessageTime)}`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages && data.messages.length > 0) {
            // Append new messages to the list
            setMessages(prevMessages => [...prevMessages, ...data.messages])

            // Mark as read if new messages arrived
            fetch('/api/messages/mark-read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversationId })
            })
          }
        }
      } catch (err) {
        // Silently fail - will retry on next interval
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      // Clear typing status when leaving
      if (isTyping) {
        sendTypingStatus(false)
      }
    }
  }, [conversationId, currentUserId, isTyping, messages])

  const sendTypingStatus = async (typing: boolean) => {
    try {
      await fetch('/api/messages/typing-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          isTyping: typing
        })
      })
    } catch (err) {
      // Silently fail - typing status is not critical
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)

    // Send typing status
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      sendTypingStatus(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to stop typing status after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTypingStatus(false)
    }, 3000)

    // If input is empty, immediately stop typing
    if (!value.trim() && isTyping) {
      setIsTyping(false)
      sendTypingStatus(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Stop typing indicator
    setIsTyping(false)
    sendTypingStatus(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content: newMessage.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const { message } = await response.json()
      setMessages([...messages, message])
      setNewMessage('')
      scrollToBottom()
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            const senderName = message.sender.bakerProfile?.businessName || message.sender.email

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <p className="text-xs text-gray-600 mb-1 px-1">{senderName}</p>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwn
                        ? 'bg-gradient-to-r from-cake-pink to-cake-purple text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {new Date(message.createdAt).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <p className="text-xs text-gray-600 mb-1 px-1">{otherUserName}</p>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">typing...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}
