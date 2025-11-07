import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get platform stats
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.bakerProfile.count(),
    prisma.cakeListing.count(),
    prisma.order.count(),
    prisma.course.count(),
    prisma.courseEnrollment.count(),
    prisma.review.count(),
    prisma.buyerRequest.count(),
    prisma.verification.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } }
    })
  ])

  const [
    totalUsers,
    totalBakers,
    totalCakes,
    totalOrders,
    totalCourses,
    totalEnrollments,
    totalReviews,
    totalBuyerRequests,
    pendingVerifications,
    revenueData
  ] = stats

  const totalRevenue = revenueData._sum.totalAmount || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{totalUsers}</p>
          <p className="text-sm text-gray-600 mt-1">{totalBakers} bakers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Cakes</h3>
          <p className="text-3xl font-bold text-cake-pink mt-2">{totalCakes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-cake-yellow mt-2">£{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Courses</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalCourses}</p>
          <p className="text-sm text-gray-600 mt-1">{totalEnrollments} enrollments</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{totalReviews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Buyer Requests</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalBuyerRequests}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Verifications</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{pendingVerifications}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/admin/courses"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">📚</span>
            <span className="font-medium">Manage Courses</span>
          </Link>

          <Link
            href="/dashboard/admin/content"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">📝</span>
            <span className="font-medium">Manage Content</span>
          </Link>

          <Link
            href="/dashboard/admin/verifications"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition relative"
          >
            {pendingVerifications > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {pendingVerifications}
              </span>
            )}
            <span className="text-4xl mb-2">✅</span>
            <span className="font-medium">Verifications</span>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">👥</span>
            <span className="font-medium">Manage Users</span>
          </Link>

          <Link
            href="/dashboard/admin/newsletters"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">📧</span>
            <span className="font-medium">Newsletters</span>
          </Link>

          <Link
            href="/dashboard/admin/shipping-kits"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">📦</span>
            <span className="font-medium">Shipping Kits</span>
          </Link>

          <Link
            href="/dashboard/admin/insurance"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">🛡️</span>
            <span className="font-medium">Insurance</span>
          </Link>

          <Link
            href="/dashboard/admin/analytics"
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-cake-purple hover:bg-gray-50 transition"
          >
            <span className="text-4xl mb-2">📊</span>
            <span className="font-medium">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
