import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import Link from 'next/link'
import BakerResponseForm from '@/app/components/BakerResponseForm'

export default async function BuyerRequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const request = await prisma.buyerRequest.findUnique({
    where: { id: params.id },
    include: {
      customer: {
        select: {
          id: true,
          email: true
        }
      },
      responses: {
        include: {
          baker: {
            select: {
              id: true,
              businessName: true,
              location: true,
              deliveryRadius: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!request) {
    notFound()
  }

  const isExpired = request.expiresAt < new Date()
  const isOwner = session?.user.id === request.customerId
  const daysLeft = Math.ceil((request.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  // Check if current user (if baker) has already responded
  let bakerProfile = null
  let hasResponded = false
  if (session && session.user.role === 'BAKER') {
    bakerProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (bakerProfile) {
      hasResponded = request.responses.some(r => r.bakerId === bakerProfile!.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/buyer-requests"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Buyer Requests
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{request.title}</h1>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.urgency === 'urgent' ? '🔥 Urgent' :
                       request.urgency === 'medium' ? '⏱️ Medium Priority' :
                       '📅 Flexible Timeline'}
                    </span>

                    {isExpired ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        ❌ Expired
                      </span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        daysLeft <= 2 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        ⏰ {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-medium">📍 {request.location}</div>
                </div>
                {request.budget && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Budget</div>
                    <div className="font-medium">💰 £{request.budget.toFixed(2)}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Posted</div>
                  <div className="font-medium">
                    {new Date(request.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Responses</div>
                  <div className="font-medium">💬 {request.responses.length}</div>
                </div>
              </div>
            </div>

            {/* Responses Section */}
            {isOwner && request.responses.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Responses ({request.responses.length})</h2>
                <div className="space-y-4">
                  {request.responses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/bakers/${response.baker.id}`}
                            className="text-lg font-semibold text-cake-purple hover:text-cake-pink"
                          >
                            {response.baker.businessName}
                          </Link>
                          <p className="text-sm text-gray-600">📍 {response.baker.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">£{response.proposedPrice.toFixed(2)}</div>
                          <p className="text-sm text-gray-600">{response.deliveryTime}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{response.message}</p>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          Responded {new Date(response.createdAt).toLocaleDateString('en-GB')}
                        </span>
                        <Link
                          href={`/bakers/${response.baker.id}`}
                          className="text-sm font-medium text-cake-purple hover:text-cake-pink"
                        >
                          View Baker Profile →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isOwner && request.responses.length > 0 && !isExpired && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-4">Responses</h2>
                <p className="text-gray-600">{request.responses.length} bakers have responded to this request</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Baker Response Form */}
            {!isOwner && !isExpired && session && session.user.role === 'BAKER' && bakerProfile && !hasResponded && (
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Submit Your Proposal</h3>
                <BakerResponseForm requestId={request.id} bakerId={bakerProfile.id} />
              </div>
            )}

            {!isOwner && !isExpired && session && session.user.role === 'BAKER' && hasResponded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">✓ Response Submitted</h3>
                <p className="text-sm text-green-800">You've already responded to this request</p>
              </div>
            )}

            {!session && !isExpired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Want to respond?</h3>
                <p className="text-sm text-blue-800 mb-4">Sign in as a baker to submit your proposal</p>
                <Link
                  href="/auth/signin"
                  className="block w-full text-center bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
                >
                  Sign In
                </Link>
              </div>
            )}

            {isExpired && (
              <div className="bg-gray-100 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Request Expired</h3>
                <p className="text-sm text-gray-600">This request is no longer accepting responses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
