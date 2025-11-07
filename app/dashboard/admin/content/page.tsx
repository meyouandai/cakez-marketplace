import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import ContentManagementTable from '@/app/components/ContentManagementTable'

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get all content pages
  const allContent = await prisma.contentPage.findMany({
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

  const published = allContent.filter(c => c.published)
  const drafts = allContent.filter(c => !c.published)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">Manage blog posts and content pages</p>
        </div>
        <Link
          href="/dashboard/admin/content/new"
          className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Create New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Posts</h3>
          <p className="text-3xl font-bold text-cake-purple mt-2">{allContent.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Published</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{published.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{drafts.length}</p>
        </div>
      </div>

      {allContent.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-600 mb-6">Start creating blog posts and content pages for your platform</p>
          <Link
            href="/dashboard/admin/content/new"
            className="inline-block bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Drafts */}
          {drafts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Drafts ({drafts.length})</h2>
              <ContentManagementTable posts={drafts} isDraft={true} />
            </div>
          )}

          {/* Published */}
          {published.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Published ({published.length})</h2>
              <ContentManagementTable posts={published} isDraft={false} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
