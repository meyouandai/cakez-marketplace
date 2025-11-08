'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  courseId: string
  price: number
}

export default function EnrollButton({ courseId, price }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setError('')

    try {
      if (price === 0) {
        // Free course - direct enrollment
        const response = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to enroll')
        }

        router.refresh()
      } else {
        // Paid course - redirect to Stripe checkout
        const response = await fetch('/api/courses/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create checkout session')
        }

        const { url } = await response.json()
        window.location.href = url
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enroll. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : price === 0 ? 'Enroll for Free' : `Enroll Now - £${price}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        {price === 0
          ? 'Get instant access to this free course'
          : 'Secure payment via Stripe. Lifetime access included.'}
      </p>
    </div>
  )
}
