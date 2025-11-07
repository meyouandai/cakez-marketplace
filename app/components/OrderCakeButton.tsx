'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface OrderCakeButtonProps {
  cakeId: string
  bakerId: string
  cakeTitle: string
  cakePrice: number
}

export default function OrderCakeButton({ cakeId, bakerId, cakeTitle, cakePrice }: OrderCakeButtonProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleOrder = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cakeId,
          bakerId,
          cakeTitle,
          amount: cakePrice
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout. Please try again.')
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
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium text-lg hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : `Order This Cake - £${cakePrice.toFixed(2)}`}
      </button>
    </div>
  )
}
