import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import CakeCard from '@/app/components/CakeCard'

interface BakerProfilePageProps {
  params: {
    id: string
  }
}

export default async function BakerProfilePage({ params }: BakerProfilePageProps) {
  // Demo baker data
  const baker = {
    id: params.id,
    businessName: 'Sweet Sarah\'s Bakery',
    location: 'London',
    description: 'Award-winning artisan bakery specializing in custom celebration cakes. We use only the finest organic ingredients and create each cake with love and attention to detail.',
    deliveryRadius: 10,
    quickResponderBadge: true,
    featured: true,
    user: {
      email: 'sarah@sweetbakery.com',
      verificationStatus: 'VERIFIED',
      trustBadges: [],
      _count: {
        reviews: 42
      }
    },
    cakeListings: [
      {
        id: 'demo-cake-1',
        title: 'Classic Chocolate Birthday Cake',
        description: 'Rich chocolate sponge with chocolate buttercream frosting',
        price: 25.99,
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'],
        active: true,
        baker: {
          id: params.id,
          businessName: 'Sweet Sarah\'s Bakery',
          location: 'London',
          user: {
            verificationStatus: 'VERIFIED'
          }
        },
        _count: {
          orders: 5
        }
      },
      {
        id: 'demo-cake-2',
        title: 'Vanilla Wedding Cake',
        description: 'Elegant 3-tier vanilla cake with white fondant',
        price: 150.00,
        images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500'],
        active: true,
        baker: {
          id: params.id,
          businessName: 'Sweet Sarah\'s Bakery',
          location: 'London',
          user: {
            verificationStatus: 'VERIFIED'
          }
        },
        _count: {
          orders: 12
        }
      }
    ],
    _count: {
      cakeListings: 8,
      orders: 45
    }
  }

  // Calculate average rating (placeholder for now)
  const averageRating = 4.8
  const totalReviews = baker.user._count.reviews

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Baker Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cake-pink to-cake-purple rounded-full flex items-center justify-center">
              <span className="text-white text-6xl font-bold">
                {baker.businessName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{baker.businessName}</h1>
                <p className="text-gray-600 mb-4">📍 {baker.location}</p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {baker.user.verificationStatus === 'VERIFIED' && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Verified Baker
                    </span>
                  )}
                  {baker.quickResponderBadge && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ⚡ Quick Responder
                    </span>
                  )}
                  {baker.featured && (
                    <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{baker._count.cakeListings}</span>
                    <span className="text-gray-600"> Cakes</span>
                  </div>
                  <div>
                    <span className="font-semibold">{baker._count.orders}</span>
                    <span className="text-gray-600"> Orders</span>
                  </div>
                  <div>
                    <span className="font-semibold">{averageRating}★</span>
                    <span className="text-gray-600"> ({totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Delivers within</p>
                <p className="text-2xl font-bold text-cake-purple">{baker.deliveryRadius} miles</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{baker.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cakes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Cakes</h2>
        {baker.cakeListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No cakes available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {baker.cakeListings.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}