'use client'

import { useState } from 'react'

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage('Successfully subscribed! Check your email for confirmation.')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Failed to subscribe. Please try again.')
    }
  }

  return (
    <div className="bg-gradient-to-r from-cake-pink to-cake-purple p-8 rounded-lg">
      <h3 className="text-2xl font-bold text-white mb-2">
        Stay Sweet! 🍰
      </h3>
      <p className="text-white/90 mb-4">
        Subscribe to get weekly cake tips, baker spotlights, and exclusive deals
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-cake-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 transition"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${
          status === 'success' ? 'text-white font-medium' : 'text-red-100'
        }`}>
          {message}
        </p>
      )}

      <p className="text-xs text-white/70 mt-3">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  )
}
