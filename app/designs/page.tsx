'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Design {
  id: string
  userId: string
  userEmail: string
  shape: string
  size: string
  layers: number
  flavor: string
  filling: string
  frosting: {
    type: string
    color: string
  }
  decorations: {
    flowers: boolean
    sprinkles: boolean
    berries: boolean
    chocolate_chips: boolean
    custom_text: string
    border_style: string
  }
  theme: string
  special_instructions: string
  estimatedPrice: number
  createdAt: string
  status: string
}

export default function MyDesignsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/designs'))
    } else if (session) {
      fetchDesigns()
    }
  }, [session, status, router])

  const fetchDesigns = async () => {
    try {
      const response = await fetch('/api/designs')
      if (response.ok) {
        const data = await response.json()
        setDesigns(data.designs || [])
      }
    } catch (error) {
      console.error('Error fetching designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return

    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDesigns(designs.filter(d => d.id !== designId))
      }
    } catch (error) {
      console.error('Error deleting design:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cake-purple"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">My Designs</h1>
              <p className="text-gray-600 mt-1">Your saved cake designs</p>
            </div>
            <Link href="/design" className="btn-primary">
              ✨ Create New Design
            </Link>
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {designs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎂</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first custom cake design with our visual editor
            </p>
            <Link href="/design" className="btn-primary">
              ✨ Start Designing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div key={design.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-hover transition-shadow">
                {/* Design Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
                  <div className="text-4xl mb-4">🎂</div>
                  <div className="text-sm text-gray-600">
                    {design.shape} • {design.size} • {design.layers} layer{design.layers > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Design Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {design.theme.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Cake
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(design.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold gradient-text">
                        £{design.estimatedPrice}
                      </div>
                    </div>
                  </div>

                  {/* Quick Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-16">Flavor:</span>
                      <span className="font-medium capitalize">{design.flavor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-16">Frosting:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: design.frosting.color }}
                        ></div>
                        <span className="font-medium capitalize">{design.frosting.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorations */}
                  {(design.decorations.flowers || design.decorations.sprinkles || design.decorations.berries || design.decorations.chocolate_chips || design.decorations.custom_text) && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Decorations:</div>
                      <div className="flex flex-wrap gap-1">
                        {design.decorations.flowers && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                            🌸 Flowers
                          </span>
                        )}
                        {design.decorations.sprinkles && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            ✨ Sprinkles
                          </span>
                        )}
                        {design.decorations.berries && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            🍓 Berries
                          </span>
                        )}
                        {design.decorations.chocolate_chips && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                            🍫 Chocolate
                          </span>
                        )}
                        {design.decorations.custom_text && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            💬 Text
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/designs/${design.id}`}
                      className="flex-1 btn-secondary text-center py-2 text-sm"
                    >
                      👀 View
                    </Link>
                    <Link
                      href={`/design?edit=${design.id}`}
                      className="flex-1 btn-secondary text-center py-2 text-sm"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteDesign(design.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-cake-pink to-cake-purple rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to create something amazing?</h3>
              <p className="opacity-90">
                Use our visual designer to create the perfect custom cake for any occasion
              </p>
            </div>
            <Link href="/design" className="bg-white text-cake-purple px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Designing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
