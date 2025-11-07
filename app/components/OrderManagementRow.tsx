'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrderManagementRowProps {
  orderId: string
  currentStatus: string
}

export default function OrderManagementRow({ orderId, currentStatus }: OrderManagementRowProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const router = useRouter()

  const statusFlow = {
    PENDING: { next: 'ACCEPTED', label: 'Accept Order', color: 'bg-blue-600' },
    ACCEPTED: { next: 'IN_PROGRESS', label: 'Start Working', color: 'bg-purple-600' },
    IN_PROGRESS: { next: 'COMPLETED', label: 'Mark Complete', color: 'bg-green-600' },
    COMPLETED: { next: null, label: 'Completed', color: 'bg-gray-400' }
  }

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          deliveryDate: deliveryDate || undefined,
          deliveryAddress: deliveryAddress || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setStatus(newStatus)
      router.refresh()
    } catch (err) {
      setError('Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'CANCELLED' })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      setStatus('CANCELLED')
      router.refresh()
    } catch (err) {
      setError('Failed to cancel order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentFlow = statusFlow[status as keyof typeof statusFlow]

  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">This order has been cancelled</p>
      </div>
    )
  }

  return (
    <div className="border-t pt-4 mt-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Delivery Details Form - Show when accepting order */}
      {status === 'PENDING' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Set Delivery Details (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {currentFlow?.next && (
          <button
            onClick={() => updateStatus(currentFlow.next!)}
            disabled={loading}
            className={`${currentFlow.color} text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition`}
          >
            {loading ? 'Updating...' : currentFlow.label}
          </button>
        )}

        {status !== 'COMPLETED' && (
          <button
            onClick={cancelOrder}
            disabled={loading}
            className="border border-red-300 text-red-700 px-6 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 transition"
          >
            Cancel Order
          </button>
        )}

        {status === 'COMPLETED' && (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Order Completed</span>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <strong>Order Status Flow:</strong> Pending → Accepted → In Progress → Completed
      </div>
    </div>
  )
}
