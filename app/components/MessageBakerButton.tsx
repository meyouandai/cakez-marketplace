'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MessageBakerButtonProps {
  bakerId: string
  bakerName: string
  context?: string
}

export default function MessageBakerButton({ bakerId, bakerName, context }: MessageBakerButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleMessage = async () => {
    setLoading(true)
    setError('')

    try {
      // Create or get existing conversation with this baker
      const response = await fetch('/api/messages/start-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: bakerId,
          initialMessage: context
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to start conversation')
      }

      const { conversationId } = await response.json()
      router.push(`/messages/${conversationId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to start conversation. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleMessage}
        disabled={loading}
        className="w-full bg-white border-2 border-cake-purple text-cake-purple px-6 py-3 rounded-lg font-medium hover:bg-cake-purple hover:text-white transition disabled:opacity-50"
      >
        {loading ? 'Opening...' : `Message ${bakerName}`}
      </button>
    </div>
  )
}
