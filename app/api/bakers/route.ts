import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/bakers - Search and filter bakers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Fetch bakers with cake listings count
    const [bakers, total] = await Promise.all([
      prisma.bakerProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
            }
          },
          _count: {
            select: {
              cakeListings: true,
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.bakerProfile.count({ where })
    ])

    return NextResponse.json({
      bakers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bakers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bakers' },
      { status: 500 }
    )
  }
}