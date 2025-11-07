import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import UserManagementTable from '@/app/components/UserManagementTable'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get all users with related data
  const users = await prisma.user.findMany({
    include: {
      bakerProfile: {
        select: {
          businessName: true,
          location: true,
          _count: {
            select: {
              cakeListings: true,
              orders: true
            }
          }
        }
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
          sentMessages: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalUsers = users.length
  const bakers = users.filter(u => u.role === 'BAKER').length
  const customers = users.filter(u => u.role === 'CUSTOMER').length
  const admins = users.filter(u => u.role === 'ADMIN').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">Manage platform users and their roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Bakers</h3>
          <p className="text-3xl font-bold text-cake-pink mt-2">{bakers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Customers</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{customers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Admins</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{admins}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Users</h2>
        </div>
        <UserManagementTable users={users} currentAdminId={session.user.id} />
      </div>
    </div>
  )
}
