import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ReviewForm from '@/app/components/ReviewForm'
import Link from 'next/link'

export default async function ReviewOrderPage({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      cake: {
        select: {
          title: true,
          images: true
        }
      },
      baker: {
        select: {
          businessName: true
        }
      },
      review: true
    }
  })

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <Link
          href="/dashboard/customer"
          className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (order.customerId !== session.user.id) {
    redirect('/dashboard/customer')
  }

  if (order.status !== 'COMPLETED') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Yet Completed</h1>
        <p className="text-gray-600 mb-6">You can only leave a review once your order is completed.</p>
        <Link
          href="/dashboard/customer"
          className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (order.review) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Review</h1>

          <div className="mb-6">
            <div className="flex gap-4">
              {order.cake.images[0] && (
                <img
                  src={order.cake.images[0]}
                  alt={order.cake.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{order.cake.title}</h3>
                <p className="text-gray-600">From {order.baker.businessName}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-500 text-2xl">
                {'★'.repeat(order.review.rating)}{'☆'.repeat(5 - order.review.rating)}
              </span>
              <span className="text-gray-600 font-medium">{order.review.rating} out of 5</span>
            </div>
            <p className="text-gray-700">{order.review.comment}</p>
            {order.review.photos && order.review.photos.length > 0 && (
              <div className="mt-4 flex gap-2">
                {order.review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Submitted on {new Date(order.review.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          <Link
            href="/dashboard/customer"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h1>
        <p className="text-gray-600 mb-6">Share your experience with this cake order</p>

        <div className="mb-8 pb-6 border-b">
          <div className="flex gap-4">
            {order.cake.images[0] && (
              <img
                src={order.cake.images[0]}
                alt={order.cake.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{order.cake.title}</h3>
              <p className="text-gray-600">From {order.baker.businessName}</p>
              <p className="text-sm text-gray-500">
                Completed on {new Date(order.updatedAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </div>

        <ReviewForm orderId={order.id} />
      </div>
    </div>
  )
}
