import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import CakeCard from '@/app/components/CakeCard'

interface BakerProfilePageProps {
  params: {
    id: string
  }
}

export default async function BakerProfilePage({ params }: BakerProfilePageProps) {
  const baker = await prisma.bakerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          email: true,
          verificationStatus: true,
          trustBadges: true,
          _count: {
            select: {
              reviews: true
            }
          }
        }
      },
      cakeListings: {
        where: { active: true },
        include: {
          baker: {
            include: {
              user: {
                select: {
                  verificationStatus: true
                }
              }
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        }
      },
      _count: {
        select: {
          orders: true,
          cakeListings: true
        }
      }
    }
  })

  if (!baker) {
    notFound()
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