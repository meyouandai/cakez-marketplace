'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard/customer')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cake-pink/20 to-cake-purple/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. The baker will contact you shortly to confirm details and arrange delivery.
        </p>

        <div className="bg-cake-pink/10 border border-cake-pink/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>What happens next?</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
            <li>✅ Payment confirmed</li>
            <li>📧 Confirmation email sent</li>
            <li>👨‍🍳 Baker will contact you within 24 hours</li>
            <li>🎂 Cake will be prepared for your occasion</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard/customer"
            className="block w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            View My Orders
          </Link>

          <Link
            href="/browse"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continue Browsing
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Redirecting to your dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cake-pink/20 to-cake-purple/20 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
