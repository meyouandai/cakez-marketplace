'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  category: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  author: {
    email: string
    bakerProfile?: {
      businessName: string
    } | null
  }
}

interface ContentManagementTableProps {
  posts: Post[]
  isDraft: boolean
}

export default function ContentManagementTable({ posts, isDraft }: ContentManagementTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unpublish' : 'publish'} this post?`)) {
      return
    }

    setActionLoading(postId)

    try {
      const response = await fetch('/api/content/toggle-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, published: !currentStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to update post. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setActionLoading(postId)

    try {
      const response = await fetch('/api/content/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to delete post. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Author</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const authorName = post.author.bakerProfile?.businessName || post.author.email

              return (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-cake-pink/10 text-cake-pink text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{authorName}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {post.published && (
                        <Link
                          href={`/blog/${post.id}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/admin/content/${post.id}/edit`}
                        className="text-sm text-cake-purple hover:text-cake-pink font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        disabled={actionLoading === post.id}
                        className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        {actionLoading === post.id ? '...' : post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={actionLoading === post.id}
                        className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
