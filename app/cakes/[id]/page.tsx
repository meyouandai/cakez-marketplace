import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import OrderCakeButton from '@/app/components/OrderCakeButton'
import MessageBakerButton from '@/app/components/MessageBakerButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

interface CakeDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CakeDetailsPage({ params }: CakeDetailsPageProps) {
  const session = await getServerSession(authOptions)

  const cake = await prisma.cakeListing.findUnique({
    where: { id: params.id },
    include: {
      baker: {
        select: {
          id: true,
          userId: true,
          businessName: true,
          location: true,
          deliveryRadius: true,
          featured: true
        }
      },
      categoryRelation: true
    }
  })

  if (!cake || !cake.active) {
    notFound()
  }

  // Fetch reviews for this specific cake
  const reviews = await prisma.review.findMany({
    where: {
      order: {
        cakeId: cake.id
      }
    },
    include: {
      order: {
        include: {
          customer: {
            select: {
              email: true
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden mb-4">
            {cake.images[0] ? (
              <Image
                src={cake.images[0]}
                alt={cake.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
                <span className="text-white text-8xl">🍰</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {cake.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {cake.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${cake.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cake Details */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-2">{cake.title}</h1>
            <p className="text-gray-600 mb-2">{cake.categoryRelation.name}</p>

            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">{'★'.repeat(Math.round(Number(averageRating)))}</span>
                <span className="text-sm text-gray-600">
                  {averageRating} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <div className="text-4xl font-bold text-cake-purple mb-6">
              £{cake.price}
            </div>

            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{cake.description}</p>
            </div>

            {/* Order & Message Buttons */}
            <div className="space-y-3 mb-6">
              <OrderCakeButton
                cakeId={cake.id}
                bakerId={cake.baker.id}
                cakeTitle={cake.title}
                cakePrice={cake.price}
              />

              {session && session.user.id !== cake.baker.userId && (
                <MessageBakerButton
                  bakerId={cake.baker.userId}
                  bakerName={cake.baker.businessName}
                  context={`Interested in: ${cake.title}`}
                />
              )}

              {!session && (
                <Link
                  href="/auth/signin"
                  className="block w-full bg-white border-2 border-cake-purple text-cake-purple text-center px-6 py-3 rounded-lg font-medium hover:bg-cake-purple hover:text-white transition"
                >
                  Sign In to Message Baker
                </Link>
              )}
            </div>

            {/* Baker Info */}
            <div className="border-t pt-6">
              <Link href={`/bakers/${cake.baker.id}`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition">
                  <div>
                    <h3 className="font-semibold">{cake.baker.businessName}</h3>
                    <p className="text-sm text-gray-600">📍 {cake.baker.location}</p>
                  </div>
                  <div className="text-right">
                    {cake.baker.featured && (
                      <span className="text-gold-600 text-sm font-semibold">⭐ Featured</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to order and leave a review!</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
                  <div className="text-yellow-500 text-2xl">{'★'.repeat(Math.round(Number(averageRating)))}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(r => r.rating === star).length
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 w-12">{star} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}