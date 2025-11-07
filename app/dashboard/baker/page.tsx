import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function BakerDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'BAKER') {
    redirect('/auth/signin')
  }

  // Check if baker has a profile
  const bakerProfile = await prisma.bakerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          cakeListings: true,
          orders: true
        }
      }
    }
  })

  if (!bakerProfile) {
    redirect('/dashboard/baker/profile')
  }

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    where: { bakerId: bakerProfile.id },
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
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  // Calculate total revenue
  const totalRevenue = await prisma.order.aggregate({
    where: {
      bakerId: bakerProfile.id,
      status: { not: 'CANCELLED' }
    },
    _sum: {
      totalAmount: true
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {bakerProfile.businessName}!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Cakes</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">
            {bakerProfile._count.cakeListings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-cake-pink mt-2">
            {bakerProfile._count.orders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            £{(totalRevenue._sum.totalAmount || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Profile Views</h3>
          <p className="text-3xl font-bold text-cake-mint mt-2">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/baker/cakes/new"
            className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Add New Cake
          </Link>
          <Link
            href="/dashboard/baker/cakes"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            Manage Cakes
          </Link>
          <Link
            href="/dashboard/baker/orders"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            View Orders
          </Link>
          <Link
            href="/messages"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            Messages
          </Link>
          <Link
            href="/dashboard/baker/profile"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/dashboard/baker/orders"
            className="text-sm text-cake-purple hover:text-cake-pink font-medium"
          >
            View All →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Cake</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">{order.id.slice(0, 8)}...</td>
                    <td className="py-2">{order.cake.title}</td>
                    <td className="py-2">{order.customer.email}</td>
                    <td className="py-2 font-semibold">£{order.totalAmount.toFixed(2)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No orders yet. When customers purchase your cakes, they'll appear here!</p>
        )}
      </div>

    </div>
  )
}