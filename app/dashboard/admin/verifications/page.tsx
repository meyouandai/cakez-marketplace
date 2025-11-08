import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import VerificationReviewCard from '@/app/components/VerificationReviewCard'

export default async function AdminVerificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get all verifications
  const allVerifications = await prisma.verification.findMany({
    include: {
      user: {
        select: {
          email: true,
          bakerProfile: {
            select: {
              businessName: true,
              location: true
            }
          }
        }
      }
    },
    orderBy: { submittedDate: 'desc' }
  })

  const pending = allVerifications.filter(v => v.status === 'PENDING')
  const verified = allVerifications.filter(v => v.status === 'VERIFIED')
  const rejected = allVerifications.filter(v => v.status === 'REJECTED')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Baker Verifications
        </h1>
        <p className="text-gray-600">Review and approve baker verification requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Requests</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{allVerifications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pending.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Verified</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{verified.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{rejected.length}</p>
        </div>
      </div>

      {allVerifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No verification requests yet</h3>
          <p className="text-gray-600">When bakers submit verification requests, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Verifications */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Pending Review ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((verification) => (
                  <VerificationReviewCard
                    key={verification.id}
                    verification={verification}
                    adminId={session.user.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Verified */}
          {verified.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Verified ({verified.length})
              </h2>
              <div className="space-y-4">
                {verified.map((verification) => {
                  const bakerName = verification.user.bakerProfile?.businessName || verification.user.email

                  return (
                    <div key={verification.id} className="bg-white rounded-lg shadow border-l-4 border-green-500 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{bakerName}</h3>
                          <p className="text-sm text-gray-600 mb-2">{verification.user.email}</p>
                          {verification.user.bakerProfile?.location && (
                            <p className="text-sm text-gray-600">📍 {verification.user.bakerProfile.location}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mb-2">
                            ✅ VERIFIED
                          </span>
                          <p className="text-xs text-gray-500">
                            Verified: {new Date(verification.verifiedDate!).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rejected */}
          {rejected.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Rejected ({rejected.length})
              </h2>
              <div className="space-y-4">
                {rejected.slice(0, 5).map((verification) => {
                  const bakerName = verification.user.bakerProfile?.businessName || verification.user.email

                  return (
                    <div key={verification.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">{bakerName}</h3>
                          <p className="text-sm text-gray-600">{verification.user.email}</p>
                          {verification.reviewNotes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Reason:</strong> {verification.reviewNotes}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          REJECTED
                        </span>
                      </div>
                    </div>
                  )
                })}
                {rejected.length > 5 && (
                  <p className="text-sm text-gray-600 text-center">
                    Showing 5 most recent rejections
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
