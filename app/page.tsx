import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/app/lib/prisma'
import FavoriteButton from '@/app/components/FavoriteButton'

export const revalidate = 60 // Revalidate every 60 seconds

async function getFeaturedCakes() {
  const cakes = await prisma.cakeListing.findMany({
    where: {
      active: true,
    },
    take: 12,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      baker: {
        include: {
          user: {
            select: {
              id: true,
            }
          }
        }
      },
      _count: {
        select: {
          orders: true,
        }
      }
    }
  })

  // Get review counts and average ratings for each cake
  const cakesWithReviews = await Promise.all(
    cakes.map(async (cake) => {
      const reviews = await prisma.review.findMany({
        where: {
          order: {
            cakeId: cake.id
          }
        },
        select: {
          rating: true,
        }
      })

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

      return {
        ...cake,
        reviewCount: reviews.length,
        averageRating: avgRating,
      }
    })
  )

  return cakesWithReviews
}

async function getFeaturedBakers() {
  const bakers = await prisma.bakerProfile.findMany({
    where: {
      featured: true,
    },
    take: 6,
    include: {
      user: {
        select: {
          id: true,
        }
      },
      _count: {
        select: {
          cakeListings: true,
        }
      }
    }
  })

  // Get review counts and average ratings for each baker
  const bakersWithReviews = await Promise.all(
    bakers.map(async (baker) => {
      const reviews = await prisma.review.findMany({
        where: {
          order: {
            bakerId: baker.id
          }
        },
        select: {
          rating: true,
        }
      })

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

      return {
        ...baker,
        reviewCount: reviews.length,
        averageRating: avgRating,
      }
    })
  )

  return bakersWithReviews
}

async function getCategories() {
  return await prisma.category.findMany({
    take: 10,
    orderBy: {
      name: 'asc'
    }
  })
}

export default async function Home() {
  const [featuredCakes, featuredBakers, categories] = await Promise.all([
    getFeaturedCakes(),
    getFeaturedBakers(),
    getCategories(),
  ])

  const categoryEmojis: { [key: string]: string } = {
    'Birthday': '🎂',
    'Wedding': '💒',
    'Anniversary': '💕',
    'Baby Shower': '👶',
    'Graduation': '🎓',
    'Corporate': '💼',
    'Holiday': '🎄',
    'Custom': '✨',
    'Chocolate': '🍫',
    'Cupcakes': '🧁',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 text-center">
        <p className="text-sm font-medium">
          🎉 <strong>Free Nationwide Delivery</strong> on orders over £50 · Use code <strong className="underline">WELCOME10</strong>
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Most Amazing<br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Cakes
              </span>{' '}
              Delivered
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
              Discover handcrafted masterpieces from the UK's most talented bakers
            </p>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for cakes, occasions, or bakers..."
                  className="w-full px-6 py-5 pr-32 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-500 shadow-sm"
                />
                <button className="absolute right-2 top-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition">
                  Search
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span className="font-medium text-gray-900">4.9/5</span>
                <span>from 2,000+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">500+ Verified Bakers</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Nationwide Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.id}`}
                className="flex-shrink-0 group"
              >
                <div className="flex flex-col items-center gap-3 px-6 py-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transition min-w-[120px]">
                  <div className="text-4xl">
                    {categoryEmojis[category.name] || '🎂'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 text-center whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cakes Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Most Popular Cakes
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked favorites loved by our community
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden md:flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-lg group"
            >
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Cakes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredCakes.map((cake) => (
              <Link
                key={cake.id}
                href={`/cake/${cake.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {cake.images.length > 0 ? (
                      <img
                        src={cake.images[0]}
                        alt={cake.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <span className="text-7xl">🎂</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {cake._count.orders > 10 && (
                        <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow">
                          BEST SELLER
                        </span>
                      )}
                      {cake.freshIndicator && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow">
                          FRESH TODAY
                        </span>
                      )}
                    </div>

                    {/* Heart Button */}
                    <FavoriteButton />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition line-clamp-1">
                      {cake.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      by {cake.baker.businessName}
                    </p>

                    {/* Rating & Price Row */}
                    <div className="flex items-center justify-between mb-3">
                      {cake.reviewCount > 0 ? (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                          <span className="text-sm font-semibold text-gray-900">{cake.averageRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({cake.reviewCount})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No reviews yet</span>
                      )}
                      <span className="text-xl font-bold text-gray-900">£{cake.price.toFixed(2)}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 font-medium rounded-full">
                        Free Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              View All Cakes
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Bakers */}
      {featuredBakers.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Talented Bakers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Award-winning artisans creating edible masterpieces
              </p>
            </div>

            {/* Bakers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBakers.map((baker) => (
                <Link
                  key={baker.id}
                  href={`/baker/${baker.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl shadow-lg">
                      👨‍🍳
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition">
                      {baker.businessName}
                    </h3>
                    <p className="text-gray-500 mb-4 text-sm">📍 {baker.location}</p>

                    {baker.reviewCount > 0 ? (
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="font-semibold text-gray-900">{baker.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({baker.reviewCount} reviews)</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mb-4">New baker</p>
                    )}

                    <p className="text-sm text-gray-600 font-medium">
                      {baker._count.cakeListings} {baker._count.cakeListings === 1 ? 'creation' : 'creations'} available
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your perfect cake in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">1. Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse thousands of handcrafted cakes from verified bakers across the UK
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">2. Order</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose your perfect cake and checkout securely with free nationwide delivery
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🎂</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">3. Celebrate</h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy your delicious masterpiece delivered fresh and ready to wow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Baker CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Are You a Baker?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of bakers growing their business on Cakez.<br />
            List for free and reach customers nationwide.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-5 bg-white text-purple-600 font-bold text-lg rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Selling Today →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-2xl mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Cakez
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                The UK's premier marketplace for handcrafted cakes, connecting customers with talented bakers nationwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">
                  <span className="text-lg">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">
                  <span className="text-lg">🐦</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Shop</h4>
              <ul className="space-y-3">
                <li><Link href="/browse" className="hover:text-white transition">Browse Cakes</Link></li>
                <li><Link href="/bakers" className="hover:text-white transition">Find Bakers</Link></li>
                <li><Link href="/browse?category=birthday" className="hover:text-white transition">Birthday Cakes</Link></li>
                <li><Link href="/browse?category=wedding" className="hover:text-white transition">Wedding Cakes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">For Bakers</h4>
              <ul className="space-y-3">
                <li><Link href="/auth/signup" className="hover:text-white transition">Join as Baker</Link></li>
                <li><Link href="/dashboard/baker" className="hover:text-white transition">Baker Dashboard</Link></li>
                <li><Link href="/about" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2024 Cakez. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
              <a href="#" className="hover:text-white transition">Accessibility</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
