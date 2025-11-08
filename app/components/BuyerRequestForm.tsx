'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BuyerRequestForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState<string>('medium')
  const [budget, setBudget] = useState('')
  const [daysValid, setDaysValid] = useState('7')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (description.length < 50) {
      setError('Please provide a more detailed description (at least 50 characters)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/buyer-requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          urgency,
          budget: budget ? parseFloat(budget) : null,
          daysValid: parseInt(daysValid)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create request')
      }

      const { request } = await response.json()
      router.push(`/buyer-requests/${request.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Request Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="e.g., Custom 3-tier Wedding Cake"
          required
          maxLength={100}
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="Describe what you're looking for in detail... Include flavors, design ideas, number of servings, dietary requirements, etc."
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {description.length} characters (minimum 50)
        </p>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="e.g., London, Manchester, Birmingham"
          required
        />
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'flexible', label: 'Flexible', icon: '📅', color: 'green' },
            { value: 'medium', label: 'Medium', icon: '⏱️', color: 'yellow' },
            { value: 'urgent', label: 'Urgent', icon: '🔥', color: 'red' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setUrgency(option.value)}
              className={`px-4 py-3 border-2 rounded-lg text-center transition ${
                urgency === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          Budget (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2 text-gray-500">£</span>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Sharing your budget helps bakers provide accurate proposals
        </p>
      </div>

      {/* Days Valid */}
      <div>
        <label htmlFor="daysValid" className="block text-sm font-medium text-gray-700 mb-2">
          Request Valid For
        </label>
        <select
          id="daysValid"
          value={daysValid}
          onChange={(e) => setDaysValid(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
        >
          <option value="3">3 days</option>
          <option value="7">7 days (recommended)</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-cake-pink to-cake-purple text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Posting...' : 'Post Request'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
