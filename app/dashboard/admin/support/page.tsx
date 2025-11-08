import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function AdminSupportPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get all support conversations
  const supportConversations = await prisma.conversation.findMany({
    where: {
      type: 'SUPPORT'
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            select: {
              email: true,
              role: true
            }
          }
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // Separate by status
  const openTickets = supportConversations.filter(c => c.status === 'OPEN')
  const inProgressTickets = supportConversations.filter(c => c.status === 'IN_PROGRESS')
  const resolvedTickets = supportConversations.filter(c => c.status === 'RESOLVED')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Support Tickets
        </h1>
        <p className="text-gray-600">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Tickets</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{supportConversations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Open</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{openTickets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressTickets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Resolved</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{resolvedTickets.length}</p>
        </div>
      </div>

      {supportConversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
          <p className="text-gray-600">When users contact support, their requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Open Tickets */}
          {openTickets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Open Tickets ({openTickets.length})
              </h2>
              <div className="space-y-4">
                {openTickets.map((ticket) => {
                  const customer = ticket.participants.find(p => p.user.role !== 'ADMIN')
                  const lastMessage = ticket.messages[0]

                  return (
                    <div key={ticket.id} className="bg-white rounded-lg shadow border-l-4 border-red-500 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: <span className="font-medium">{customer?.user.email}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            OPEN
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(ticket.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>

                      {lastMessage && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{lastMessage.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last message: {new Date(lastMessage.createdAt).toLocaleString('en-GB')}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {ticket._count.messages} {ticket._count.messages === 1 ? 'message' : 'messages'}
                        </span>
                        <Link
                          href={`/messages/${ticket.id}`}
                          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                        >
                          View & Reply →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* In Progress Tickets */}
          {inProgressTickets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                In Progress ({inProgressTickets.length})
              </h2>
              <div className="space-y-4">
                {inProgressTickets.map((ticket) => {
                  const customer = ticket.participants.find(p => p.user.role !== 'ADMIN')
                  const lastMessage = ticket.messages[0]

                  return (
                    <div key={ticket.id} className="bg-white rounded-lg shadow border-l-4 border-yellow-500 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: <span className="font-medium">{customer?.user.email}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            IN PROGRESS
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(ticket.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>

                      {lastMessage && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{lastMessage.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last message: {new Date(lastMessage.createdAt).toLocaleString('en-GB')}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {ticket._count.messages} {ticket._count.messages === 1 ? 'message' : 'messages'}
                        </span>
                        <Link
                          href={`/messages/${ticket.id}`}
                          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                        >
                          View & Reply →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Resolved Tickets */}
          {resolvedTickets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Resolved ({resolvedTickets.length})
              </h2>
              <div className="space-y-4">
                {resolvedTickets.slice(0, 10).map((ticket) => {
                  const customer = ticket.participants.find(p => p.user.role !== 'ADMIN')

                  return (
                    <div key={ticket.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {customer?.user.email} • Resolved {new Date(ticket.updatedAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <Link
                          href={`/messages/${ticket.id}`}
                          className="text-sm font-medium text-cake-purple hover:text-cake-pink"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
              {resolvedTickets.length > 10 && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Showing 10 most recent resolved tickets
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
