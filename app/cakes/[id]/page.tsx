import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CakeDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CakeDetailsPage({ params }: CakeDetailsPageProps) {
  // Demo cake data
  const cake = {
    id: params.id,
    title: 'Classic Chocolate Birthday Cake',
    description: 'Rich chocolate sponge with chocolate buttercream frosting. Perfect for birthday celebrations. Made with premium Belgian chocolate and organic ingredients.',
    price: 25.99,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'],
    active: true,
    urgencyFlag: false,
    freshIndicator: true,
    bulkPricing: true,
    categoryRelation: {
      name: 'Birthday Cakes'
    },
    baker: {
      id: 'demo-baker-1',
      businessName: 'Sweet Sarah\'s Bakery',
      location: 'London',
      user: {
        verificationStatus: 'VERIFIED'
      }
    },
    _count: {
      orders: 5
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden mb-4">
            {cake.images[0] ? (
              <Image
                src={cake.images[0]}
                alt={cake.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
                <span className="text-white text-8xl">🍰</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {cake.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {cake.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${cake.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cake Details */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {cake.urgencyFlag && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🔥 Urgent Orders Available
                </span>
              )}
              {cake.freshIndicator && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🌟 Fresh Today
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{cake.title}</h1>
            <p className="text-gray-600 mb-4">{cake.categoryRelation.name}</p>

            <div className="text-4xl font-bold text-cake-purple mb-6">
              £{cake.price}
            </div>

            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{cake.description}</p>
            </div>

            {/* Bulk Pricing */}
            {cake.bulkPricing && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">💰 Bulk Discounts Available</h3>
                <p className="text-sm text-gray-600">Contact baker for bulk order pricing</p>
              </div>
            )}

            {/* Order Button */}
            <button className="w-full bg-gradient-to-r from-cake-pink to-cake-purple text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition mb-6">
              Order This Cake
            </button>

            {/* Baker Info */}
            <div className="border-t pt-6">
              <Link href={`/bakers/${cake.baker.id}`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition">
                  <div>
                    <h3 className="font-semibold">{cake.baker.businessName}</h3>
                    <p className="text-sm text-gray-600">📍 {cake.baker.location}</p>
                  </div>
                  <div className="text-right">
                    {cake.baker.user.verificationStatus === 'VERIFIED' && (
                      <span className="text-blue-600 text-sm font-semibold">✓ Verified</span>
                    )}
                    {cake._count.orders > 0 && (
                      <p className="text-sm text-gray-500">{cake._count.orders} orders</p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}