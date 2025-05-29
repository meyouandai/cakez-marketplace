'use client'

import { useState, useEffect } from 'react'

interface SearchFiltersProps {
  filters: {
    search: string
    category: string
    minPrice: string
    maxPrice: string
    location: string
  }
  onFiltersChange: (filters: any) => void
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="Search cakes..."
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={localFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range (£)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="Min"
              min="0"
            />
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
              placeholder="Max"
              min="0"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={localFilters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="City or postcode"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}