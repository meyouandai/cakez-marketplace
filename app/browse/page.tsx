'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchFilters from '@/app/components/SearchFilters'
import CakeCard from '@/app/components/CakeCard'

export default function BrowseCakes() {
  const [cakes, setCakes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchCakes()
  }, [filters, pagination.page])

  const fetchCakes = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value
        return acc
      }, {} as Record<string, string>)
    })

    try {
      const response = await fetch(`/api/cakes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCakes(data.cakes)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching cakes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Cakes</h1>
        <p className="text-gray-600">Discover delicious cakes from talented local bakers</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <SearchFilters 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Cakes Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading delicious cakes...</div>
            </div>
          ) : cakes.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cakes found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cakes.map((cake) => (
                  <CakeCard key={cake.id} cake={cake} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                        className={`px-4 py-2 rounded-lg ${
                          pagination.page === i + 1
                            ? 'bg-gradient-to-r from-cake-pink to-cake-purple text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}