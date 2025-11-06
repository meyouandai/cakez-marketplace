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

  const inquiries = await prisma.inquiry.findMany({
    where: { customerId: session.user.id },
    include: {
      baker: {
        select: {
          businessName: true,
          location: true
        }
      }
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
          <h3 className="font-semibold text-lg mb-2">📬 Your Inquiries</h3>
          <p className="text-3xl font-bold">{inquiries.length}</p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Inquiries</h2>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-gray-600 mb-6">Start browsing cakes and contact bakers to get started!</p>
            <Link
              href="/browse"
              className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Browse Cakes
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {inquiry.baker.businessName}
                    </h3>
                    <p className="text-sm text-gray-600">📍 {inquiry.baker.location}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                    inquiry.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Your message:</strong>
                  </p>
                  <p className="text-sm text-gray-600">{inquiry.message}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    Sent on {new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-600">
                    Contact: {inquiry.customerEmail}
                    {inquiry.customerPhone && ` • ${inquiry.customerPhone}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {inquiries.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Bakers will contact you via email or phone. Check your inbox regularly for responses!
          </p>
        </div>
      )}
    </div>
  )
}
