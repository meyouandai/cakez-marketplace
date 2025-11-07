'use client'

import { useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
  createdAt: Date
  bakerProfile?: {
    businessName: string
    location: string
    _count: {
      cakeListings: number
      orders: number
    }
  } | null
  _count: {
    orders: number
    reviews: number
    sentMessages: number
  }
}

interface UserManagementTableProps {
  users: User[]
  currentAdminId: string
}

export default function UserManagementTable({ users, currentAdminId }: UserManagementTableProps) {
  const [filterRole, setFilterRole] = useState<string>('ALL')

  const filteredUsers = filterRole === 'ALL'
    ? users
    : users.filter(u => u.role === filterRole)

  return (
    <div>
      {/* Filter */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter by role:</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cake-purple focus:border-transparent"
          >
            <option value="ALL">All Users ({users.length})</option>
            <option value="BAKER">Bakers ({users.filter(u => u.role === 'BAKER').length})</option>
            <option value="CUSTOMER">Customers ({users.filter(u => u.role === 'CUSTOMER').length})</option>
            <option value="ADMIN">Admins ({users.filter(u => u.role === 'ADMIN').length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Activity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const displayName = user.bakerProfile?.businessName || user.email

              return (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{displayName}</div>
                      {user.bakerProfile && (
                        <div className="text-xs text-gray-600">📍 {user.bakerProfile.location}</div>
                      )}
                      {user.email !== displayName && (
                        <div className="text-xs text-gray-500">{user.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-green-100 text-green-800' :
                      user.role === 'BAKER' ? 'bg-cake-pink/10 text-cake-pink' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.role === 'BAKER' && user.bakerProfile ? (
                      <div className="space-y-1">
                        <div>{user.bakerProfile._count.cakeListings} cakes</div>
                        <div>{user.bakerProfile._count.orders} orders</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div>{user._count.orders} orders</div>
                        <div>{user._count.reviews} reviews</div>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'BAKER' && (
                        <Link
                          href={`/bakers/${user.id}`}
                          className="text-sm text-cake-purple hover:text-cake-pink font-medium"
                        >
                          View Profile
                        </Link>
                      )}
                      {user.id !== currentAdminId && (
                        <button
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                          title="More actions coming soon"
                        >
                          •••
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No users found for the selected filter</p>
        </div>
      )}
    </div>
  )
}
