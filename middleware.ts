import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes - allow all
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/signup',
      '/bakers',
      '/browse',
      '/blog',
      '/courses',
      '/buyer-requests',
      '/insurance',
      '/shipping-kits',
      '/support',
      '/sentry-example-page',
    ]

    // Check if path starts with any public route
    const isPublicRoute = publicRoutes.some(route =>
      path === route || path.startsWith(`${route}/`)
    )

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    const role = token.role as string

    // Role-based access control
    if (path.startsWith('/dashboard/admin')) {
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, req.url))
      }
    }

    if (path.startsWith('/dashboard/baker')) {
      if (role !== 'BAKER') {
        return NextResponse.redirect(new URL(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer', req.url))
      }
    }

    if (path.startsWith('/dashboard/customer')) {
      if (role !== 'CUSTOMER') {
        return NextResponse.redirect(new URL(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/baker', req.url))
      }
    }

    // Baker-only routes
    if (path.startsWith('/dashboard/baker') || path.includes('/cakes/new')) {
      if (role !== 'BAKER' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Customer-only routes
    if (path.startsWith('/buyer-requests/create') || path.includes('/review')) {
      if (role !== 'CUSTOMER' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if token exists or for public routes
        // Actual role checks are done in the middleware function above
        return true
      },
    },
  }
)

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
