'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactSupportForm() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/support/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `[${category.toUpperCase()}] ${subject}`,
          message: message.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit support request')
      }

      const { conversationId } = await response.json()
      router.push(`/messages/${conversationId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={loading}
        >
          <option value="general">General Inquiry</option>
          <option value="order">Order Issue</option>
          <option value="payment">Payment Problem</option>
          <option value="account">Account Help</option>
          <option value="baker">Baker Issue</option>
          <option value="technical">Technical Problem</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of your issue"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={loading}
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{subject.length}/100 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please provide details about your issue. Include order numbers, usernames, or any relevant information."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent resize-none"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">{message.length} characters</p>
      </div>

      <button
        type="submit"
        disabled={loading || !subject.trim() || !message.trim()}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Submitting...' : 'Submit Support Request'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Your request will be sent to our support team. You'll receive a response via the Messages page.
      </p>
    </form>
  )
}
