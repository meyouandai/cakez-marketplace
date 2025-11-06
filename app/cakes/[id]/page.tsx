import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'
import InquiryForm from '@/app/components/InquiryForm'

interface CakeDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CakeDetailsPage({ params }: CakeDetailsPageProps) {
  const cake = await prisma.cakeListing.findUnique({
    where: { id: params.id },
    include: {
      baker: {
        select: {
          id: true,
          businessName: true,
          location: true,
          deliveryRadius: true,
          featured: true
        }
      },
      categoryRelation: true
    }
  })

  if (!cake || !cake.active) {
    notFound()
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
            <h1 className="text-3xl font-bold mb-2">{cake.title}</h1>
            <p className="text-gray-600 mb-4">{cake.categoryRelation.name}</p>

            <div className="text-4xl font-bold text-cake-purple mb-6">
              £{cake.price}
            </div>

            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{cake.description}</p>
            </div>

            {/* Inquiry Form */}
            <InquiryForm
              cakeId={cake.id}
              bakerId={cake.baker.id}
              bakerName={cake.baker.businessName}
              cakeTitle={cake.title}
            />

            {/* Baker Info */}
            <div className="border-t pt-6">
              <Link href={`/bakers/${cake.baker.id}`}>
                <div className="flex items-center justify-between hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition">
                  <div>
                    <h3 className="font-semibold">{cake.baker.businessName}</h3>
                    <p className="text-sm text-gray-600">📍 {cake.baker.location}</p>
                  </div>
                  <div className="text-right">
                    {cake.baker.featured && (
                      <span className="text-gold-600 text-sm font-semibold">⭐ Featured</span>
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