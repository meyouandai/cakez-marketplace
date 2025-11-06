import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { z } from 'zod'
import prisma from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

const cakeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string(),
  images: z.array(z.string().url()).min(1)
})

// GET /api/cakes - Search and filter cakes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      active: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (location) {
      where.baker = {
        location: { contains: location, mode: 'insensitive' }
      }
    }

    // Fetch cakes with baker info
    const [cakes, total] = await Promise.all([
      prisma.cakeListing.findMany({
        where,
        skip,
        take: limit,
        include: {
          baker: {
            select: {
              id: true,
              businessName: true,
              location: true,
              featured: true,
            }
          },
          categoryRelation: {
            select: {
              name: true,
            }
          }
        },
        orderBy: [
          { baker: { featured: 'desc' } },
          { createdAt: 'desc' }
        ]
      }),
      prisma.cakeListing.count({ where })
    ])

    return NextResponse.json({
      cakes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching cakes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cakes' },
      { status: 500 }
    )
  }
}

// POST /api/cakes - Create new cake listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized - Baker account required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = cakeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Find baker profile for this user
    const bakerProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!bakerProfile) {
      return NextResponse.json(
        { error: 'Baker profile not found. Please create your profile first.' },
        { status: 404 }
      )
    }

    // Create cake listing
    const cake = await prisma.cakeListing.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        price: validation.data.price,
        category: validation.data.category,
        images: validation.data.images,
        bakerId: bakerProfile.id,
      },
      include: {
        baker: {
          select: {
            id: true,
            businessName: true,
            location: true,
          }
        },
        categoryRelation: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json(cake, { status: 201 })
  } catch (error) {
    console.error('Error creating cake listing:', error)
    return NextResponse.json(
      { error: 'Failed to create cake listing' },
      { status: 500 }
    )
  }
}