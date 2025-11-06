'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface InquiryFormProps {
  cakeId: string
  bakerId: string
  bakerName: string
  cakeTitle: string
}

export default function InquiryForm({ cakeId, bakerId, bakerName, cakeTitle }: InquiryFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cakeId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone || '',
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to proceed to checkout. Please try again.')
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleButtonClick}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition mb-6"
      >
        Buy This Cake 🛒
      </button>
    )
  }

  return (
    <div className="mb-6">
      <div className="bg-white border-2 border-cake-pink rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Order from {bakerName}</h3>
        <p className="text-sm text-gray-600 mb-4">
          <strong>{cakeTitle}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="+44 7700 900000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="When do you need it? Any special decorations, flavors, or dietary requirements?"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💳 You'll be taken to secure payment. The baker will contact you after payment to confirm all details.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
