'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NewsletterSendFormProps {
  subscriberCount: number
}

export default function NewsletterSendForm({ subscriberCount }: NewsletterSendFormProps) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required')
      return
    }

    if (!confirm(`Send this newsletter to ${subscriberCount} subscribers?`)) {
      return
    }

    setSending(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send newsletter')
      }

      setSuccess(true)
      setSubject('')
      setContent('')

      // Refresh the page to show the new newsletter in the list
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to send newsletter. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            ✅ Newsletter sent successfully to {subscriberCount} subscribers!
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📧 Ready to send:</strong> This newsletter will be sent to {subscriberCount} active {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Weekly Cake Inspiration & Baker Spotlights"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={sending}
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{subject.length}/100 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Newsletter Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your newsletter content here. You can include:&#10;&#10;- Featured bakers or cakes&#10;- Upcoming events&#10;- Tips and tricks&#10;- Special offers&#10;- Platform updates"
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent resize-none font-mono text-sm"
          disabled={sending}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Newsletter Best Practices</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• Keep subject lines under 50 characters for better open rates</li>
          <li>• Include a clear call-to-action (e.g., "Browse New Cakes")</li>
          <li>• Personalize with baker spotlights or customer success stories</li>
          <li>• Send consistently (weekly or monthly) to build engagement</li>
          <li>• Always include value (tips, deals, inspiration)</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={sending || !subject.trim() || !content.trim()}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {sending ? 'Sending Newsletter...' : `Send Newsletter to ${subscriberCount} Subscribers`}
      </button>
    </form>
  )
}
