import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'

export type UserRole = 'CUSTOMER' | 'BAKER' | 'ADMIN'

/**
 * Require authentication - redirects to signin if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return session
}

/**
 * Require specific role - redirects to appropriate dashboard or 403 if wrong role
 */
export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const session = await requireAuth()

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (!roles.includes(session.user.role as UserRole)) {
    // Redirect to user's appropriate dashboard based on their actual role
    switch (session.user.role) {
      case 'ADMIN':
        redirect('/dashboard/admin')
      case 'BAKER':
        redirect('/dashboard/baker')
      case 'CUSTOMER':
        redirect('/dashboard/customer')
      default:
        redirect('/auth/signin')
    }
  }

  return session
}

/**
 * Get session or null (doesn't redirect)
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Check if user has specific role (doesn't redirect)
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.role === role
}

/**
 * Get role-specific redirect path
 */
export function getRoleDashboard(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin'
    case 'BAKER':
      return '/dashboard/baker'
    case 'CUSTOMER':
      return '/dashboard/customer'
    default:
      return '/'
  }
}
