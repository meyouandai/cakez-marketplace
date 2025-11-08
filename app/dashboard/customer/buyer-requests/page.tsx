import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function MyBuyerRequestsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const requests = await prisma.buyerRequest.findMany({
    where: { customerId: session.user.id },
    include: {
      _count: {
        select: {
          responses: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const activeRequests = requests.filter(r => r.expiresAt > new Date())
  const expiredRequests = requests.filter(r => r.expiresAt <= new Date())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Buyer Requests</h1>
          <p className="text-gray-600 mt-2">Track your posted requests and responses</p>
        </div>
        <Link
          href="/buyer-requests/create"
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Post New Request
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Requests</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{requests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{activeRequests.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Responses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {requests.reduce((sum, r) => sum + r._count.responses, 0)}
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
          <p className="text-gray-600 mb-6">Create a buyer request to receive proposals from bakers</p>
          <Link
            href="/buyer-requests/create"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Post Your First Request
          </Link>
        </div>
      ) : (
        <>
          {/* Active Requests */}
          {activeRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Active Requests</h2>
              <div className="space-y-4">
                {activeRequests.map((request) => {
                  const daysLeft = Math.ceil((request.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                  return (
                    <div key={request.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📍 {request.location}</span>
                            {request.budget && <span>💰 £{request.budget}</span>}
                            <span className={daysLeft <= 2 ? 'text-red-600 font-semibold' : ''}>
                              ⏰ {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                            </span>
                          </div>
                        </div>

                        <div className="ml-6 text-center">
                          <div className="text-3xl font-bold text-cake-purple mb-1">
                            {request._count.responses}
                          </div>
                          <div className="text-sm text-gray-600">
                            {request._count.responses === 1 ? 'Response' : 'Responses'}
                          </div>
                          <Link
                            href={`/buyer-requests/${request.id}`}
                            className="mt-3 inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Expired Requests */}
          {expiredRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Expired Requests</h2>
              <div className="space-y-4">
                {expiredRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-700">{request.title}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                            Expired
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          Posted {new Date(request.createdAt).toLocaleDateString('en-GB')} •
                          Expired {new Date(request.expiresAt).toLocaleDateString('en-GB')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request._count.responses} {request._count.responses === 1 ? 'response' : 'responses'} received
                        </p>
                      </div>

                      <Link
                        href={`/buyer-requests/${request.id}`}
                        className="ml-4 text-sm font-medium text-cake-purple hover:text-cake-pink"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
