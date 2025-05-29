'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-cake-pink to-cake-purple bg-clip-text text-transparent">
                Cakez
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/browse" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
              Browse Cakes
            </Link>
            <Link href="/bakers" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
              Find Bakers
            </Link>

            {status === 'authenticated' ? (
              <>
                {session.user.role === 'BAKER' && (
                  <>
                    <Link href="/dashboard/baker" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
                      My Dashboard
                    </Link>
                    <Link href="/dashboard/baker/cakes" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
                      My Cakes
                    </Link>
                  </>
                )}
                {session.user.role === 'CUSTOMER' && (
                  <>
                    <Link href="/dashboard/customer" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
                      My Orders
                    </Link>
                  </>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-700 hover:text-cake-purple px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-gradient-to-r from-cake-pink to-cake-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                  Join as Baker
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-cake-purple focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/browse" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
              Browse Cakes
            </Link>
            <Link href="/bakers" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
              Find Bakers
            </Link>
            {status === 'authenticated' ? (
              <>
                {session.user.role === 'BAKER' && (
                  <>
                    <Link href="/dashboard/baker" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
                      My Dashboard
                    </Link>
                    <Link href="/dashboard/baker/cakes" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
                      My Cakes
                    </Link>
                  </>
                )}
                {session.user.role === 'CUSTOMER' && (
                  <Link href="/dashboard/customer" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
                    My Orders
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="text-gray-700 hover:text-cake-purple block px-3 py-2 rounded-md text-base font-medium">
                  Join as Baker
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}