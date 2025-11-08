'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import CakeDesigner from '../components/CakeDesigner'

export default function DesignPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSaveDesign = async (designData: any) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/design'))
      return
    }

    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/designs/${result.id}`)
      }
    } catch (error) {
      console.error('Error saving design:', error)
    }
  }

  const handleOrderDesign = async (designData: any) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/design'))
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom_design',
          design: designData,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Custom Cake Designer</h1>
              <p className="text-gray-600 mt-1">Design your perfect cake with our visual editor</p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Designer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CakeDesigner
          onSave={handleSaveDesign}
          onOrder={handleOrderDesign}
        />
      </div>
    </div>
  )
}
