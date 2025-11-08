'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface VerificationRequestFormProps {
  bakerProfileId: string
  userId: string
}

export default function VerificationRequestForm({ bakerProfileId, userId }: VerificationRequestFormProps) {
  const [businessLicense, setBusinessLicense] = useState('')
  const [insurancePolicy, setInsurancePolicy] = useState('')
  const [hygieneCertificate, setHygieneCertificate] = useState('')
  const [idDocument, setIdDocument] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessLicense && !insurancePolicy && !hygieneCertificate && !idDocument) {
      setError('Please provide at least one form of verification document')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          businessLicense: businessLicense.trim(),
          insurancePolicy: insurancePolicy.trim(),
          hygieneCertificate: hygieneCertificate.trim(),
          idDocument: idDocument.trim(),
          additionalInfo: additionalInfo.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit verification request')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📋 What You'll Need
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Provide URLs to your verification documents. Documents can be hosted on Google Drive, Dropbox, or similar services (make sure links are publicly accessible).
        </p>
        <div className="text-sm text-blue-800 space-y-2">
          <div><strong>Required (at least one):</strong></div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Business registration/license</li>
            <li>Food hygiene certificate</li>
            <li>Liability insurance policy</li>
            <li>Government-issued ID</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration / License
        </label>
        <input
          type="url"
          value={businessLicense}
          onChange={(e) => setBusinessLicense(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={submitting}
        />
        <p className="text-xs text-gray-500 mt-1">Link to your business registration or license document</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Insurance Policy
        </label>
        <input
          type="url"
          value={insurancePolicy}
          onChange={(e) => setInsurancePolicy(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={submitting}
        />
        <p className="text-xs text-gray-500 mt-1">Link to your liability insurance policy</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Food Hygiene Certificate
        </label>
        <input
          type="url"
          value={hygieneCertificate}
          onChange={(e) => setHygieneCertificate(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={submitting}
        />
        <p className="text-xs text-gray-500 mt-1">Link to your food hygiene/safety certificate</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Government-Issued ID
        </label>
        <input
          type="url"
          value={idDocument}
          onChange={(e) => setIdDocument(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          disabled={submitting}
        />
        <p className="text-xs text-gray-500 mt-1">Link to your driver's license, passport, or other government ID</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information (Optional)
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Provide any additional context or information that might help with your verification"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent resize-none"
          disabled={submitting}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
        <ul className="text-xs text-yellow-800 space-y-1">
          <li>• All documents must be valid and current</li>
          <li>• Ensure all document links are publicly accessible</li>
          <li>• Review typically takes 2-3 business days</li>
          <li>• We'll notify you via email once reviewed</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {submitting ? 'Submitting Verification Request...' : 'Submit Verification Request'}
      </button>
    </form>
  )
}
