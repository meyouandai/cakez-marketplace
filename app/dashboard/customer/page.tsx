import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      baker: {
        select: {
          businessName: true,
          location: true
        }
      },
      cake: {
        select: {
          title: true,
          images: true
        }
      },
      review: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.email}!
        </h1>
        <p className="text-gray-600">Track your cake inquiries and discover new bakers</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/browse"
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white p-6 rounded-lg hover:opacity-90 transition"
        >
          <h3 className="font-semibold text-lg mb-2">🔍 Browse Cakes</h3>
          <p className="text-sm text-white/90">Discover amazing cakes from local bakers</p>
        </Link>

        <Link
          href="/bakers"
          className="bg-gradient-to-r from-cake-purple to-cake-blue text-white p-6 rounded-lg hover:opacity-90 transition"
        >
          <h3 className="font-semibold text-lg mb-2">👨‍🍳 Find Bakers</h3>
          <p className="text-sm text-white/90">Explore talented bakers in your area</p>
        </Link>

        <div className="bg-gradient-to-r from-cake-mint to-cake-yellow text-white p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">🎂 Your Orders</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start browsing cakes and place your first order!</p>
            <Link
              href="/browse"
              className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Browse Cakes
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-4">
                    {order.cake.images[0] && (
                      <img
                        src={order.cake.images[0]}
                        alt={order.cake.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {order.cake.title}
                      </h3>
                      <p className="text-sm text-gray-600">From {order.baker.businessName}</p>
                      <p className="text-sm text-gray-600">📍 {order.baker.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">£{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {order.specialRequests && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Special requests:</strong>
                    </p>
                    <p className="text-sm text-gray-600">{order.specialRequests}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mt-3">
                  <div className="text-gray-500">
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {order.status === 'COMPLETED' && !order.review && (
                    <Link
                      href={`/orders/${order.id}/review`}
                      className="text-cake-pink hover:text-cake-purple font-medium"
                    >
                      Leave a Review →
                    </Link>
                  )}
                  {order.review && (
                    <div className="text-gray-600 flex items-center gap-1">
                      <span className="text-yellow-500">{'★'.repeat(order.review.rating)}</span>
                      <span>Your review</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {orders.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Bakers will contact you via email to confirm details and arrange delivery!
          </p>
        </div>
      )}
    </div>
  )
}
