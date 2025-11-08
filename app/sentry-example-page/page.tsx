'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryExamplePage() {
  const [eventId, setEventId] = useState<string | null>(null)

  const throwError = () => {
    try {
      // This will trigger a Sentry error
      throw new Error('Sentry Test Error - This is a test error from Cakez Marketplace')
    } catch (error) {
      // Capture the error with Sentry
      const id = Sentry.captureException(error)
      setEventId(id)
      console.error('Error captured by Sentry:', id)
    }
  }

  const throwUncaughtError = () => {
    // This will be caught by Sentry automatically (uncaught error)
    // @ts-ignore - intentionally calling undefined function
    myUndefinedFunction()
  }

  const sendTestMessage = () => {
    const id = Sentry.captureMessage('Sentry Test Message - Hello from Cakez Marketplace! 👋', 'info')
    setEventId(id)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sentry Error Monitoring Test
          </h1>
          <p className="text-gray-600 mb-8">
            Test the Sentry integration by triggering sample errors
          </p>

          {/* Status */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">Status</h2>
            <p className="text-sm text-blue-700">
              {process.env.NEXT_PUBLIC_SENTRY_DSN
                ? '✅ Sentry DSN configured'
                : '⚠️ Sentry DSN not configured'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Environment: {process.env.NODE_ENV}
            </p>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4 mb-8">
            <div>
              <button
                onClick={throwError}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Test 1: Throw Caught Error
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Throws an error that's caught and sent to Sentry
              </p>
            </div>

            <div>
              <button
                onClick={throwUncaughtError}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Test 2: Throw Uncaught Error
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Calls an undefined function (automatic error capture)
              </p>
            </div>

            <div>
              <button
                onClick={sendTestMessage}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Test 3: Send Test Message
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Sends a test message to Sentry (not an error)
              </p>
            </div>
          </div>

          {/* Result */}
          {eventId && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Event Captured!</h3>
              <p className="text-sm text-green-700">
                Event ID: <code className="bg-green-100 px-2 py-1 rounded">{eventId}</code>
              </p>
              <p className="text-xs text-green-600 mt-2">
                Check your Sentry dashboard at{' '}
                <a
                  href="https://overflo-digital.sentry.io/issues/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  overflo-digital.sentry.io
                </a>
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How to Verify</h3>
            <ol className="text-sm text-gray-700 space-y-2">
              <li>1. Click one of the test buttons above</li>
              <li>2. Go to your Sentry dashboard</li>
              <li>
                3. Navigate to Issues → You should see the error/message
              </li>
              <li>4. Click on the issue to see full details</li>
            </ol>
          </div>

          {/* Configuration Info */}
          <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Configuration</h3>
            <div className="text-sm text-purple-700 space-y-1">
              <p>
                <span className="font-medium">Organization:</span> overflo-digital
              </p>
              <p>
                <span className="font-medium">Project:</span> javascript-nextjs
              </p>
              <p className="text-xs text-purple-600 mt-2">
                Note: In development mode, errors are filtered. Test in production or staging for full error capture.
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-cake-purple hover:underline"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
