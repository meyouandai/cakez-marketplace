'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const required = searchParams.get('required')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    // If redirected from middleware (no token, but required=true)
    if (!token && required === 'true') {
      setStatus('pending')
      setMessage('Please verify your email address to continue')
      return
    }

    // If no token and not required, show error
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    // If token exists, verify it
    verifyEmail(token)
  }, [token, required])

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

  const handleResendEmail = async () => {
    setResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.')
      } else {
        setMessage(data.error || 'Failed to send verification email. Please try again.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setResending(false)
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

          {status === 'pending' && (
            <>
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-700 mb-4">
                We sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <Link
                href="/auth/signout"
                className="block mt-4 text-cake-purple hover:underline text-sm"
              >
                Sign out
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cake-purple"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
