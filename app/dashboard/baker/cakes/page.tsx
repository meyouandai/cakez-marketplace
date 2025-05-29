import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function BakerCakesPage() {
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

  const cakes = await prisma.cakeListing.findMany({
    where: { bakerId: bakerProfile.id },
    include: {
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Cakes</h1>
        <Link
          href="/dashboard/baker/cakes/new"
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Add New Cake
        </Link>
      </div>

      {cakes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No cakes yet</h2>
          <p className="text-gray-600 mb-6">Start showcasing your delicious cakes to attract customers!</p>
          <Link
            href="/dashboard/baker/cakes/new"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Add Your First Cake
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48">
                {cake.images[0] ? (
                  <Image
                    src={cake.images[0]}
                    alt={cake.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
                    <span className="text-white text-4xl">🍰</span>
                  </div>
                )}
                {!cake.active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Inactive</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{cake.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{cake.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-cake-purple">£{cake.price}</span>
                  <span className="text-sm text-gray-500">{cake._count.orders} orders</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/baker/cakes/${cake.id}/edit`}
                    className="flex-1 text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    Edit
                  </Link>
                  <button
                    className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
                  >
                    {cake.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}