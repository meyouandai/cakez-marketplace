'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Verification failed. The link may have expired.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cake-purple mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Email...
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to sign in...
              </p>
              <Link
                href="/auth/signin"
                className="inline-block mt-4 text-cake-purple hover:underline"
              >
                Click here if not redirected automatically
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-2">
                <Link
                  href="/auth/signup"
                  className="block bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Sign Up Again
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-cake-purple hover:underline"
                >
                  Already verified? Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
