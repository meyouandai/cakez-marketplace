import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

export default async function BuyerRequestsPage() {
  const session = await getServerSession(authOptions)

  // Get active buyer requests that haven't expired
  const requests = await prisma.buyerRequest.findMany({
    where: {
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      customer: {
        select: {
          email: true
        }
      },
      _count: {
        select: {
          responses: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cake-pink to-cake-purple text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buyer Requests</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Browse customer requests and submit your proposals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Requests</h2>
            <p className="text-gray-600 mt-1">{requests.length} requests available</p>
          </div>

          {session && (
            <Link
              href="/buyer-requests/create"
              className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Post a Request
            </Link>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active requests</h3>
            <p className="text-gray-600 mb-6">Be the first to post a buyer request!</p>
            {session && (
              <Link
                href="/buyer-requests/create"
                className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
              >
                Post a Request
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => {
              const daysLeft = Math.ceil((request.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

              return (
                <div key={request.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {request.title || 'Custom Cake Request'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency === 'urgent' ? '🔥 Urgent' :
                           request.urgency === 'medium' ? '⏱️ Medium' :
                           '📅 Flexible'}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{request.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📍 {request.location}</span>
                        {request.budget && <span>💰 Budget: £{request.budget}</span>}
                        <span>💬 {request._count.responses} responses</span>
                        <span className={daysLeft <= 2 ? 'text-red-600 font-semibold' : ''}>
                          ⏰ {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/buyer-requests/${request.id}`}
                      className="ml-4 bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>

                  <div className="text-xs text-gray-500 pt-3 border-t">
                    Posted {new Date(request.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!session && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Want to post a request or respond to one?</h3>
            <p className="text-blue-800 mb-4">Sign in to get started</p>
            <Link
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
