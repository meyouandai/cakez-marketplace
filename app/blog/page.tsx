import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function BlogPage() {
  // Get all published content pages
  const posts = await prisma.contentPage.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          email: true,
          bakerProfile: {
            select: {
              businessName: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Group by category
  const categories = Array.from(new Set(posts.map(p => p.category)))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cakez Blog
          </h1>
          <p className="text-xl text-gray-600">
            Tips, inspiration, and stories from the Cakez community
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map(category => (
              <span
                key={category}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600">Check back soon for tips, inspiration, and stories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const authorName = post.author.bakerProfile?.businessName || post.author.email

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
                    <span className="text-white text-6xl">
                      {post.category === 'Tips' ? '💡' :
                       post.category === 'Stories' ? '📖' :
                       post.category === 'Inspiration' ? '✨' :
                       post.category === 'Recipes' ? '🍰' :
                       post.category === 'News' ? '📰' :
                       '📝'}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-cake-pink/10 text-cake-pink text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cake-purple transition line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.content.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">By {authorName}</span>
                      <span className="text-cake-purple font-medium group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {posts.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-cake-pink to-cake-purple rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to contribute?
            </h3>
            <p className="text-white/90 mb-6">
              Share your baking stories, tips, and experiences with the Cakez community
            </p>
            <Link
              href="/support"
              className="inline-block bg-white text-cake-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
