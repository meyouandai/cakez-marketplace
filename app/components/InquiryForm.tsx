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
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bakerProfileId: bakerId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone || undefined,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send inquiry')
      }

      alert('Inquiry sent successfully! The baker will contact you soon.')
      setIsOpen(false)
      setFormData({
        customerName: '',
        customerEmail: session?.user?.email || '',
        customerPhone: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending inquiry:', error)
      alert('Failed to send inquiry. Please try again.')
    } finally {
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
        Contact Baker
      </button>
    )
  }

  return (
    <div className="mb-6">
      <div className="bg-white border-2 border-cake-pink rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Contact {bakerName}</h3>
        <p className="text-sm text-gray-600 mb-4">Inquiring about: {cakeTitle}</p>

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
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="+44 7700 900000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="Tell the baker about your requirements, occasion, date needed, etc."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
