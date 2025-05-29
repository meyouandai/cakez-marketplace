'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Baker {
  id: string
  businessName: string
  description: string
  location: string
  deliveryRadius: number
  featured: boolean
  quickResponderBadge: boolean
  user: {
    verificationStatus: string
    trustBadges: any[]
  }
  _count: {
    orders: number
    cakeListings: number
  }
}

export default function BakersPage() {
  const [bakers, setBakers] = useState<Baker[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    fetchBakers()
  }, [searchTerm, location])

  const fetchBakers = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...(location && { location })
    })

    try {
      const response = await fetch(`/api/bakers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBakers(data.bakers)
      }
    } catch (error) {
      console.error('Error fetching bakers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Talented Bakers</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by name
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="Search bakers..."
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="City or postcode"
            />
          </div>
        </div>
      </div>

      {/* Bakers Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading bakers...</div>
        </div>
      ) : bakers.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bakers found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bakers.map((baker) => (
            <Link key={baker.id} href={`/bakers/${baker.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{baker.businessName}</h3>
                      <p className="text-gray-600">📍 {baker.location}</p>
                    </div>
                    {baker.featured && (
                      <span className="text-yellow-500 text-2xl">⭐</span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{baker.description}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {baker.user.verificationStatus === 'VERIFIED' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        ✓ Verified
                      </span>
                    )}
                    {baker.quickResponderBadge && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        ⚡ Quick Responder
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{baker._count.cakeListings} cakes</span>
                    <span>{baker._count.orders} orders</span>
                    <span>Delivers {baker.deliveryRadius} miles</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}