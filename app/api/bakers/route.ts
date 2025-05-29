import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'

// GET /api/bakers - Search and filter bakers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {}

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [bakers, total] = await Promise.all([
      prisma.bakerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              verificationStatus: true,
              trustBadges: true
            }
          },
          _count: {
            select: {
              orders: true,
              cakeListings: true
            }
          }
        },
        skip,
        take: limit,
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

// POST /api/bakers - Create baker profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { businessName, description, location, deliveryRadius } = body

    // Check if baker profile already exists
    const existingProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Baker profile already exists' },
        { status: 400 }
      )
    }

    const bakerProfile = await prisma.bakerProfile.create({
      data: {
        userId: session.user.id,
        businessName,
        description,
        location,
        deliveryRadius: parseInt(deliveryRadius)
      }
    })

    return NextResponse.json(bakerProfile, { status: 201 })
  } catch (error) {
    console.error('Error creating baker profile:', error)
    return NextResponse.json(
      { error: 'Failed to create baker profile' },
      { status: 500 }
    )
  }
}