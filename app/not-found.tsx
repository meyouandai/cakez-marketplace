import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/browse"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Browse Cakes
          </Link>
        </div>
      </div>
    </div>
  )
}
