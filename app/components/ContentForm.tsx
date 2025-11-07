'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ContentFormProps {
  authorId: string
  existingPost?: {
    id: string
    title: string
    content: string
    category: string
    published: boolean
  }
}

export default function ContentForm({ authorId, existingPost }: ContentFormProps) {
  const [title, setTitle] = useState(existingPost?.title || '')
  const [content, setContent] = useState(existingPost?.content || '')
  const [category, setCategory] = useState(existingPost?.category || 'Tips')
  const [published, setPublished] = useState(existingPost?.published || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const endpoint = existingPost
        ? '/api/content/update'
        : '/api/content/create'

      const body = existingPost
        ? { postId: existingPost.id, title: title.trim(), content: content.trim(), category, published }
        : { title: title.trim(), content: content.trim(), category, published, authorId }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save post')
      }

      const data = await response.json()

      // Redirect to content management page
      router.push('/dashboard/admin/content')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const handleSaveAsDraft = () => {
    setPublished(false)
    // Form will submit with published=false
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={saving}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={saving}
        >
          <option value="Tips">Tips</option>
          <option value="Stories">Stories</option>
          <option value="Inspiration">Inspiration</option>
          <option value="Recipes">Recipes</option>
          <option value="News">News</option>
          <option value="Guides">Guides</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post content here...&#10;&#10;You can use plain text formatting. Keep paragraphs short and readable."
          rows={20}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent resize-none"
          disabled={saving}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 text-cake-purple border-gray-300 rounded focus:ring-cake-purple"
          disabled={saving}
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publish immediately
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Writing Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use a clear, engaging title that describes the content</li>
          <li>• Break content into short paragraphs for readability</li>
          <li>• Include actionable tips or takeaways</li>
          <li>• Keep language friendly and accessible</li>
          <li>• Save as draft to review later before publishing</li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="flex-1 bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {saving ? 'Saving...' : (published ? 'Save & Publish' : 'Save as Draft')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
