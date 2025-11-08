'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!token) {
      setMessage({
        type: 'error',
        text: 'Invalid reset link. Please request a new password reset.',
      })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      return
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      })
      return
    }

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long',
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Password reset successful! Redirecting to sign in...',
        })
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'An error occurred. Please try again.',
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your new password below.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
              placeholder="••••••••"
              disabled={loading || !token}
            />
            <p className="text-sm text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
              placeholder="••••••••"
              disabled={loading || !token}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-cake-purple hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
