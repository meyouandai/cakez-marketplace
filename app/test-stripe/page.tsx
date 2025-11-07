'use client'

import { useState } from 'react'

export default function StripeTestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const testStripe = async () => {
    setLoading(true)
    setResult('Testing...')

    try {
      const response = await fetch('/api/test-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setResult(`❌ Error: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`✅ Success! Redirecting to Stripe...`)
        // Redirect to Stripe checkout
        window.location.href = data.url
      }
    } catch (error: any) {
      setResult(`❌ Failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Stripe Payment Test</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to test if Stripe is working
        </p>

        <button
          onClick={testStripe}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 mb-4"
        >
          {loading ? 'Testing...' : 'Test Stripe Payment'}
        </button>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
