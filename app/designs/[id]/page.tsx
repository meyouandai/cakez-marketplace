'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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

export default function DesignViewPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [design, setDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDesign()
  }, [])

  const fetchDesign = async () => {
    try {
      const response = await fetch(`/api/designs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setDesign(data)
      } else {
        router.push('/designs')
      }
    } catch (error) {
      console.error('Error fetching design:', error)
      router.push('/designs')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderDesign = async () => {
    if (!design || !session) return

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom_design',
          designId: design.id,
          design: design,
          customOrder: true
        })
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/orders/${result.id}/payment`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cake-purple"></div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Design Not Found</h1>
          <Link href="/designs" className="btn-primary">
            View My Designs
          </Link>
        </div>
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
              <h1 className="text-3xl font-bold gradient-text">Saved Design</h1>
              <p className="text-gray-600 mt-1">Created on {new Date(design.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/designs" className="btn-secondary">
                ← My Designs
              </Link>
              <button
                onClick={handleOrderDesign}
                className="btn-primary"
              >
                🛒 Order This Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Design Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Preview */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Design Preview</h2>

            <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
              <div className="text-6xl mb-4">🎂</div>
              <p className="text-gray-600">Visual preview would render here</p>
              <p className="text-sm text-gray-500 mt-2">
                {design.shape} • {design.size} • {design.layers} layer{design.layers > 1 ? 's' : ''}
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                £{design.estimatedPrice}
              </div>
              <p className="text-sm text-gray-600">Estimated price</p>
            </div>
          </div>

          {/* Design Specifications */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">Design Specifications</h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Shape:</span>
                    <span className="ml-2 font-medium capitalize">{design.shape}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 font-medium">{design.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Layers:</span>
                    <span className="ml-2 font-medium">{design.layers}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Flavor:</span>
                    <span className="ml-2 font-medium capitalize">{design.flavor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Filling:</span>
                    <span className="ml-2 font-medium capitalize">{design.filling.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Theme:</span>
                    <span className="ml-2 font-medium capitalize">{design.theme.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Frosting */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Frosting</h3>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: design.frosting.color }}
                  ></div>
                  <div>
                    <div className="font-medium capitalize">{design.frosting.type.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-600">{design.frosting.color}</div>
                  </div>
                </div>
              </div>

              {/* Decorations */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Decorations</h3>
                <div className="space-y-2">
                  {design.decorations.flowers && (
                    <div className="flex items-center text-sm">
                      <span className="text-pink-500 mr-2">🌸</span>
                      Sugar Flowers
                    </div>
                  )}
                  {design.decorations.sprinkles && (
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 mr-2">✨</span>
                      Sprinkles
                    </div>
                  )}
                  {design.decorations.berries && (
                    <div className="flex items-center text-sm">
                      <span className="text-red-500 mr-2">🍓</span>
                      Fresh Berries
                    </div>
                  )}
                  {design.decorations.chocolate_chips && (
                    <div className="flex items-center text-sm">
                      <span className="text-amber-600 mr-2">🍫</span>
                      Chocolate Chips
                    </div>
                  )}
                  {design.decorations.border_style !== 'none' && (
                    <div className="flex items-center text-sm">
                      <span className="text-purple-500 mr-2">🎨</span>
                      {design.decorations.border_style.replace('_', ' ')} Border
                    </div>
                  )}
                  {design.decorations.custom_text && (
                    <div className="flex items-center text-sm">
                      <span className="text-blue-500 mr-2">💬</span>
                      Text: "{design.decorations.custom_text}"
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              {design.special_instructions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Special Instructions</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{design.special_instructions}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t">
                <div className="flex gap-3">
                  <Link
                    href={`/design?edit=${design.id}`}
                    className="flex-1 btn-secondary text-center py-3"
                  >
                    ✏️ Edit Design
                  </Link>
                  <button
                    onClick={handleOrderDesign}
                    className="flex-1 btn-primary py-3"
                  >
                    🛒 Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
