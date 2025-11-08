import Link from 'next/link'
import { getSession } from '@/app/lib/auth-helpers'

export default async function UnauthorizedPage() {
  const session = await getSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-gray-200">403</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          {session
            ? "You don't have permission to access this page."
            : "You need to sign in to access this page."}
        </p>
        <div className="flex gap-4 justify-center">
          {session ? (
            <>
              <Link
                href="/"
                className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                Go Home
              </Link>
              <Link
                href={
                  session.user.role === 'ADMIN' ? '/dashboard/admin' :
                  session.user.role === 'BAKER' ? '/dashboard/baker' :
                  '/dashboard/customer'
                }
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
