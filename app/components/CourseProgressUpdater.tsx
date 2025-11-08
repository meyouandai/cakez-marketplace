'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CourseProgressUpdaterProps {
  enrollmentId: string
  currentProgress: number
}

export default function CourseProgressUpdater({ enrollmentId, currentProgress }: CourseProgressUpdaterProps) {
  const [progress, setProgress] = useState(currentProgress)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const updateProgress = async (newProgress: number) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/courses/update-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          progress: newProgress
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update progress')
      }

      setProgress(newProgress)
      router.refresh()
    } catch (err) {
      setError('Failed to update progress. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async () => {
    if (!confirm('Mark this course as complete? You will earn your certificate if applicable.')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/courses/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId })
      })

      if (!response.ok) {
        throw new Error('Failed to mark course as complete')
      }

      router.refresh()
    } catch (err) {
      setError('Failed to mark course as complete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateProgress(Math.max(0, progress - 10))}
          disabled={loading || progress === 0}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          -10%
        </button>
        <button
          onClick={() => updateProgress(Math.min(100, progress + 10))}
          disabled={loading || progress === 100}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          +10%
        </button>
        <button
          onClick={() => updateProgress(Math.min(100, progress + 25))}
          disabled={loading || progress === 100}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          +25%
        </button>
      </div>

      {progress >= 90 && (
        <button
          onClick={markComplete}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Mark Course as Complete'}
        </button>
      )}
    </div>
  )
}
