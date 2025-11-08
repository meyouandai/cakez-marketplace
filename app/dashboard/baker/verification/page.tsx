import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import VerificationRequestForm from '@/app/components/VerificationRequestForm'

export default async function BakerVerificationPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'BAKER') {
    redirect('/auth/signin')
  }

  // Check if baker has a profile
  const bakerProfile = await prisma.bakerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!bakerProfile) {
    redirect('/dashboard/baker/profile')
  }

  // Check for existing verification
  const existingVerification = await prisma.verification.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Baker Verification
      </h1>
      <p className="text-gray-600 mb-8">
        Get verified to build trust with customers and stand out on the platform
      </p>

      {existingVerification ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              existingVerification.status === 'VERIFIED'
                ? 'bg-green-100'
                : existingVerification.status === 'PENDING'
                ? 'bg-yellow-100'
                : existingVerification.status === 'REJECTED'
                ? 'bg-red-100'
                : 'bg-gray-100'
            }">
              <span className="text-4xl">
                {existingVerification.status === 'VERIFIED'
                  ? '✅'
                  : existingVerification.status === 'PENDING'
                  ? '⏳'
                  : existingVerification.status === 'REJECTED'
                  ? '❌'
                  : '📝'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Status: {existingVerification.status}
            </h2>
          </div>

          {existingVerification.status === 'VERIFIED' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                🎉 Congratulations! You're Verified!
              </h3>
              <p className="text-green-800 mb-4">
                Your verification badge is now displayed on your profile and listings, helping customers trust your business.
              </p>
              <div className="text-sm text-green-700">
                <strong>Verified since:</strong> {new Date(existingVerification.verifiedDate!).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          )}

          {existingVerification.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                ⏳ Verification Under Review
              </h3>
              <p className="text-yellow-800 mb-4">
                Your verification request is being reviewed by our team. This typically takes 2-3 business days.
              </p>
              <div className="text-sm text-yellow-700">
                <strong>Submitted:</strong> {new Date(existingVerification.submittedDate).toLocaleDateString('en-GB')}
              </div>
            </div>
          )}

          {existingVerification.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                ❌ Verification Request Declined
              </h3>
              <p className="text-red-800 mb-4">
                Unfortunately, your verification request was not approved. Please review the feedback below and resubmit with the required documentation.
              </p>
              {existingVerification.reviewNotes && (
                <div className="bg-white rounded p-4 text-sm text-red-900 mb-4">
                  <strong>Admin feedback:</strong><br />
                  {existingVerification.reviewNotes}
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
              >
                Submit New Request
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              What Verification Includes
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Verified badge on your profile and listings</li>
              <li>✓ Higher visibility in search results</li>
              <li>✓ Increased customer trust and confidence</li>
              <li>✓ Access to premium features (coming soon)</li>
            </ul>
          </div>
        </div>
      ) : (
        <VerificationRequestForm bakerProfileId={bakerProfile.id} userId={session.user.id} />
      )}
    </div>
  )
}
