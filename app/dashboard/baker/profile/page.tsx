'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const profileSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Location is required'),
  deliveryRadius: z.number().min(1).max(50)
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function BakerProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user.role !== 'BAKER') {
      router.push('/')
    } else {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/bakers/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        reset(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const method = profile ? 'PUT' : 'POST'
      const url = profile ? '/api/bakers/profile' : '/api/bakers'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      router.push('/dashboard/baker')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {profile ? 'Edit' : 'Create'} Your Baker Profile
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            {...register('businessName')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="Sweet Delights Bakery"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Business Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="Tell customers about your baking experience, specialties, and what makes your cakes special..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            {...register('location')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="London, UK"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="deliveryRadius" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Radius (miles)
          </label>
          <input
            {...register('deliveryRadius', { valueAsNumber: true })}
            type="number"
            min="1"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-pink focus:border-transparent"
            placeholder="10"
          />
          {errors.deliveryRadius && (
            <p className="text-red-500 text-sm mt-1">{errors.deliveryRadius.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">How far you're willing to deliver</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-cake-pink to-cake-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}