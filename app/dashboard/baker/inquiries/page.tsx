import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function BakerInquiriesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'BAKER') {
    redirect('/auth/signin')
  }

  const bakerProfile = await prisma.bakerProfile.findUnique({
    where: { userId: session.user.id }
  })

  if (!bakerProfile) {
    redirect('/dashboard/baker/profile')
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { bakerProfileId: bakerProfile.id },
    include: {
      customer: {
        select: {
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2">Manage customer inquiries for your cakes</p>
        </div>
        <Link
          href="/dashboard/baker"
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Inquiries</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{inquiries.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">New</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {inquiries.filter(i => i.status === 'NEW').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {inquiries.filter(i => i.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-gray-600">When customers inquire about your cakes, they'll appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Message</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {inquiry.customerName}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div>
                        <div className="mb-1">{inquiry.customerEmail}</div>
                        {inquiry.customerPhone && (
                          <div className="text-xs">{inquiry.customerPhone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="max-w-md">
                        <p className="line-clamp-2">{inquiry.message}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inquiry.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                        inquiry.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Respond to inquiries promptly by email or phone to increase your conversion rate.
          Customers appreciate quick responses!
        </p>
      </div>
    </div>
  )
}
