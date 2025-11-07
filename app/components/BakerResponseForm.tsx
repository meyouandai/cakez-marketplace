'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BakerResponseFormProps {
  requestId: string
  bakerId: string
}

export default function BakerResponseForm({ requestId, bakerId }: BakerResponseFormProps) {
  const [message, setMessage] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !proposedPrice || !deliveryTime.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (message.length < 50) {
      setError('Please provide a more detailed message (at least 50 characters)')
      return
    }

    const price = parseFloat(proposedPrice)
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/buyer-requests/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          bakerId,
          message: message.trim(),
          proposedPrice: price,
          deliveryTime: deliveryTime.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit response')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to submit response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="proposedPrice" className="block text-sm font-medium text-gray-700 mb-2">
          Your Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2 text-gray-500">£</span>
          <input
            type="number"
            id="proposedPrice"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Time <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="deliveryTime"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="e.g., 3-5 days, 1 week"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Proposal <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="Explain why you're the right baker for this request, your approach, and any relevant experience..."
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {message.length} characters (minimum 50)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Submitting...' : 'Submit Proposal'}
      </button>
    </form>
  )
}
