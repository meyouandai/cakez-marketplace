import Image from 'next/image'
import Link from 'next/link'

interface CakeCardProps {
  cake: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    urgencyFlag: boolean
    freshIndicator: boolean
    baker: {
      id: string
      businessName: string
      location: string
      user: {
        verificationStatus: string
      }
    }
    _count: {
      orders: number
    }
  }
}

export default function CakeCard({ cake }: CakeCardProps) {
  return (
    <Link href={`/cakes/${cake.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64">
          {cake.images[0] ? (
            <Image
              src={cake.images[0]}
              alt={cake.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
              <span className="text-white text-6xl">🍰</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {cake.urgencyFlag && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Urgent
              </span>
            )}
            {cake.freshIndicator && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Fresh Today
              </span>
            )}
            {cake.baker.user.verificationStatus === 'VERIFIED' && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{cake.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{cake.description}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-cake-purple">£{cake.price}</span>
            {cake._count.orders > 0 && (
              <span className="text-xs text-gray-500">
                {cake._count.orders} sold
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p className="font-medium">{cake.baker.businessName}</p>
            <p>{cake.baker.location}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}