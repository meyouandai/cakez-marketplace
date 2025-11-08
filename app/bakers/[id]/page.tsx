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
          email: true
        }
      },
      cakeListings: {
        where: { active: true },
        include: {
          baker: {
            select: {
              id: true,
              businessName: true,
              location: true,
              featured: true
            }
          },
          categoryRelation: {
            select: {
              name: true
            }
          }
        }
      },
      _count: {
        select: {
          cakeListings: true,
          orders: true
        }
      }
    }
  })

  if (!baker) {
    notFound()
  }

  // Fetch reviews for this baker
  const reviews = await prisma.review.findMany({
    where: {
      order: {
        bakerId: baker.id
      }
    },
    include: {
      order: {
        include: {
          customer: {
            select: {
              email: true
            }
          },
          cake: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Calculate average rating
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0

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
                    <span className="text-gray-600"> ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})</span>
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
      <div className="mb-12">
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

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {totalReviews > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
              <div className="text-yellow-500 text-xl">{'★'.repeat(Math.round(Number(averageRating)))}</div>
              <div className="text-sm text-gray-600">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</div>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to order and leave a review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="font-semibold text-gray-900">{review.rating} out of 5</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Order: {review.order.cake.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {review.order.customer.email.split('@')[0]} • {new Date(review.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}