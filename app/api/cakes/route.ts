import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { z } from 'zod'

const cakeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string(),
  images: z.array(z.string().url()).min(1),
  bulkPricing: z.object({
    enabled: z.boolean(),
    tiers: z.array(z.object({
      quantity: z.number().positive(),
      discount: z.number().min(0).max(100)
    }))
  }).optional()
})

// GET /api/cakes - Search and filter cakes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = { active: true }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
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
        location: {
          contains: location,
          mode: 'insensitive'
        }
      }
    }

    const [cakes, total] = await Promise.all([
      prisma.cakeListing.findMany({
        where,
        include: {
          baker: {
            include: {
              user: {
                select: {
                  verificationStatus: true
                }
              }
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { urgencyFlag: 'desc' },
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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get baker profile
    const bakerProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!bakerProfile) {
      return NextResponse.json(
        { error: 'Baker profile not found. Please complete your profile first.' },
        { status: 400 }
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

    const { title, description, price, category, images, bulkPricing } = validation.data

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: category }
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const cake = await prisma.cakeListing.create({
      data: {
        bakerId: bakerProfile.id,
        title,
        description,
        price,
        category,
        images,
        bulkPricing: bulkPricing || undefined
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