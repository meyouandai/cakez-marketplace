'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
  orderId: string
}

export default function ReviewForm({ orderId }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const router = useRouter()

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (photos.length + files.length > 5) {
      setError('You can upload a maximum of 5 photos')
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      setPhotos([...photos, ...uploadedUrls])
    } catch (err) {
      setError('Failed to upload photos. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }

    if (comment.length < 10) {
      setError('Please write at least 10 characters')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          comment,
          photos
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      router.push('/dashboard/customer')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-4xl transition-colors focus:outline-none"
            >
              <span className={
                star <= (hoverRating || rating)
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-gray-600 font-medium">
            {rating} out of 5
          </span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          placeholder="Tell us about your experience with this cake... What did you like? How was the taste, presentation, and delivery?"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Minimum 10 characters ({comment.length} / 10)
        </p>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos (Optional - Max 5)
        </label>

        {photos.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < 5 && (
          <div>
            <input
              type="file"
              id="photos"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
            <label
              htmlFor="photos"
              className={`inline-block px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Add Photos'}
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Upload photos of your cake to help other customers
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting || !comment.trim() || comment.length < 10}
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
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
