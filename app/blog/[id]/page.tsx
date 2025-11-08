import { prisma } from '@/app/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.contentPage.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          email: true,
          bakerProfile: {
            select: {
              businessName: true,
              location: true
            }
          }
        }
      }
    }
  })

  if (!post || !post.published) {
    notFound()
  }

  const authorName = post.author.bakerProfile?.businessName || post.author.email

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-cake-purple mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Post header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-br from-cake-pink to-cake-purple flex items-center justify-center">
            <span className="text-white text-8xl">
              {post.category === 'Tips' ? '💡' :
               post.category === 'Stories' ? '📖' :
               post.category === 'Inspiration' ? '✨' :
               post.category === 'Recipes' ? '🍰' :
               post.category === 'News' ? '📰' :
               '📝'}
            </span>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-cake-pink/10 text-cake-pink text-sm font-semibold rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <span>By <span className="font-medium text-gray-900">{authorName}</span></span>
              {post.author.bakerProfile?.location && (
                <span>📍 {post.author.bakerProfile.location}</span>
              )}
              <span>Updated {new Date(post.updatedAt).toLocaleDateString('en-GB')}</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>
        </div>

        {/* Share & Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Enjoyed this article?</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/browse"
              className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Browse Cakes
            </Link>
            <Link
              href="/blog"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Read More Articles
            </Link>
          </div>
        </div>

        {/* Related posts could go here */}
      </div>
    </div>
  )
}
