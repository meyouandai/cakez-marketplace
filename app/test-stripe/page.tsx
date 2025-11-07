'use client'

import { useState } from 'react'

export default function StripeTestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const testStripe = async (endpoint: string, label: string) => {
    setLoading(true)
    setResult(`Testing ${label}...`)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setResult(`❌ ${label} Error:\n${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`✅ ${label} Success! Redirecting to Stripe...`)
        // Redirect to Stripe checkout
        setTimeout(() => {
          window.location.href = data.url
        }, 1000)
      }
    } catch (error: any) {
      setResult(`❌ ${label} Failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Stripe Payment Test</h1>
        <p className="text-gray-600 mb-6">
          Testing two different approaches to Stripe integration
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => testStripe('/api/test-stripe', 'Stripe SDK')}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Test with Stripe SDK
          </button>

          <button
            onClick={() => testStripe('/api/test-stripe-direct', 'Direct API')}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Test with Direct HTTP Call
          </button>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
