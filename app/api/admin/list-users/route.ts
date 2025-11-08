import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Allow in development or for admin users
    if (process.env.NODE_ENV !== 'development' && (!session || session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        verificationStatus: true,
        createdAt: true,
        bakerProfile: {
          select: {
            businessName: true,
            location: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const stats = {
      total: users.length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      bakers: users.filter(u => u.role === 'BAKER').length,
      customers: users.filter(u => u.role === 'CUSTOMER').length,
    }

    return NextResponse.json({ users, stats })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
