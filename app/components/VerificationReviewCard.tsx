'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Verification {
  id: string
  userId: string
  submittedDate: Date
  businessLicense: string | null
  insurancePolicy: string | null
  hygieneCertificate: string | null
  idDocument: string | null
  additionalInfo: string | null
  user: {
    email: string
    bakerProfile?: {
      businessName: string
      location: string
    } | null
  }
}

interface VerificationReviewCardProps {
  verification: Verification
  adminId: string
}

export default function VerificationReviewCard({ verification, adminId }: VerificationReviewCardProps) {
  const [reviewing, setReviewing] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  const bakerName = verification.user.bakerProfile?.businessName || verification.user.email

  const handleApprove = async () => {
    if (!confirm(`Approve verification for ${bakerName}?`)) {
      return
    }

    setReviewing(true)

    try {
      const response = await fetch('/api/verification/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verification.id,
          status: 'VERIFIED',
          adminId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve verification')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to approve. Please try again.')
      setReviewing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setReviewing(true)

    try {
      const response = await fetch('/api/verification/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verification.id,
          status: 'REJECTED',
          adminId,
          reviewNotes: rejectReason.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject verification')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to reject. Please try again.')
      setReviewing(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow border-l-4 border-yellow-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{bakerName}</h3>
            <p className="text-sm text-gray-600 mb-1">{verification.user.email}</p>
            {verification.user.bakerProfile?.location && (
              <p className="text-sm text-gray-600">📍 {verification.user.bakerProfile.location}</p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 mb-2">
              PENDING
            </span>
            <p className="text-xs text-gray-500">
              Submitted: {new Date(verification.submittedDate).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">📎 Submitted Documents</h4>
          <div className="space-y-2">
            {verification.businessLicense && (
              <div>
                <span className="text-xs font-medium text-gray-700">Business License:</span>
                <a
                  href={verification.businessLicense}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                >
                  View Document →
                </a>
              </div>
            )}
            {verification.insurancePolicy && (
              <div>
                <span className="text-xs font-medium text-gray-700">Insurance Policy:</span>
                <a
                  href={verification.insurancePolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                >
                  View Document →
                </a>
              </div>
            )}
            {verification.hygieneCertificate && (
              <div>
                <span className="text-xs font-medium text-gray-700">Hygiene Certificate:</span>
                <a
                  href={verification.hygieneCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                >
                  View Document →
                </a>
              </div>
            )}
            {verification.idDocument && (
              <div>
                <span className="text-xs font-medium text-gray-700">ID Document:</span>
                <a
                  href={verification.idDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                >
                  View Document →
                </a>
              </div>
            )}
          </div>
        </div>

        {verification.additionalInfo && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Additional Information</h4>
            <p className="text-sm text-blue-800">{verification.additionalInfo}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={reviewing}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {reviewing ? 'Processing...' : '✅ Approve & Verify'}
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={reviewing}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
          >
            ❌ Reject
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this verification request. The baker will see this feedback.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Documents are expired, business license not clear, etc."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                disabled={reviewing || !rejectReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {reviewing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                disabled={reviewing}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
