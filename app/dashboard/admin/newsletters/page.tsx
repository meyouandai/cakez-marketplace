import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import NewsletterSendForm from '@/app/components/NewsletterSendForm'

export default async function AdminNewslettersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get newsletter statistics
  const [totalSubscribers, activeSubscribers, recentNewsletters] = await Promise.all([
    prisma.newsletterSubscription.count(),
    prisma.newsletterSubscription.count({ where: { active: true } }),
    prisma.newsletter.findMany({
      orderBy: { sentAt: 'desc' },
      take: 10
    })
  ])

  const inactiveSubscribers = totalSubscribers - activeSubscribers

  // Get all active subscribers for the send form
  const subscribers = await prisma.newsletterSubscription.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Newsletter Management
        </h1>
        <p className="text-gray-600">Manage subscribers and send newsletters</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Subscribers</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{totalSubscribers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{activeSubscribers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Unsubscribed</h3>
          <p className="text-3xl font-bold text-gray-600 mt-2">{inactiveSubscribers}</p>
        </div>
      </div>

      {/* Send Newsletter Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Send Newsletter</h2>
        {activeSubscribers === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No active subscribers yet. Newsletters will be sent to active subscribers.</p>
          </div>
        ) : (
          <NewsletterSendForm subscriberCount={activeSubscribers} />
        )}
      </div>

      {/* Recent Newsletters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Newsletters</h2>
        {recentNewsletters.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📧</div>
            <p className="text-gray-600">No newsletters sent yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{newsletter.subject}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {newsletter.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Sent: {new Date(newsletter.sentAt).toLocaleString('en-GB')}</span>
                      {newsletter.openRate && (
                        <span className="text-green-600">Open rate: {(newsletter.openRate * 100).toFixed(1)}%</span>
                      )}
                      {newsletter.clickRate && (
                        <span className="text-blue-600">Click rate: {(newsletter.clickRate * 100).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Subscribers</h2>
        {subscribers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Subscribed Date</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{subscriber.email}</td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(subscriber.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
