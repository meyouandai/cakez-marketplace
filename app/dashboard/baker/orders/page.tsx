import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import OrderManagementRow from '@/app/components/OrderManagementRow'

export default async function BakerOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'BAKER') {
    redirect('/auth/signin')
  }

  const bakerProfile = await prisma.bakerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!bakerProfile) {
    redirect('/dashboard/baker/profile')
  }

  const orders = await prisma.order.findMany({
    where: { bakerId: bakerProfile.id },
    include: {
      customer: {
        select: {
          email: true
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders for your cakes</p>
        </div>
        <Link
          href="/dashboard/baker"
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {orders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {orders.filter(o => o.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase">Completed</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {orders.filter(o => o.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase">Total Revenue</h3>
          <p className="text-2xl font-bold text-cake-purple mt-2">
            £{orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">When customers purchase your cakes, they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 flex-1">
                    {order.cake.images[0] && (
                      <img
                        src={order.cake.images[0]}
                        alt={order.cake.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {order.cake.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: {order.customer.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order ID: {order.id.slice(0, 8)}... • Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">£{order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {order.specialRequests && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Special Requests:</p>
                    <p className="text-sm text-gray-600">{order.specialRequests}</p>
                  </div>
                )}

                {order.deliveryDate && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Delivery:</strong> {new Date(order.deliveryDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    )}
                  </div>
                )}

                <OrderManagementRow orderId={order.id} currentStatus={order.status} />

                {order.review && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-lg">{'★'.repeat(order.review.rating)}</span>
                      <span className="text-sm text-gray-600">Customer Review</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{order.review.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Keep your order statuses updated to keep customers informed.
          Move orders through: Pending → Accepted → In Progress → Completed for best customer experience!
        </p>
      </div>
    </div>
  )
}
