import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

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
    // Return demo cake data for now
    const demoCakes = [
      {
        id: 'demo-cake-1',
        title: 'Classic Chocolate Birthday Cake',
        description: 'Rich chocolate sponge with chocolate buttercream frosting. Perfect for birthday celebrations.',
        price: 25.99,
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'],
        baker: {
          id: 'demo-baker-1',
          businessName: 'Sweet Sarah\'s Bakery',
          location: 'London',
          user: {
            verificationStatus: 'VERIFIED'
          }
        },
        _count: {
          orders: 5
        }
      },
      {
        id: 'demo-cake-2',
        title: 'Vanilla Cupcakes (Box of 12)',
        description: 'Fluffy vanilla cupcakes topped with smooth vanilla buttercream. Perfect for parties.',
        price: 18.50,
        images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500'],
        baker: {
          id: 'demo-baker-2',
          businessName: 'Chocolate Dreams',
          location: 'Manchester',
          user: {
            verificationStatus: 'VERIFIED'
          }
        },
        _count: {
          orders: 3
        }
      }
    ]

    return NextResponse.json({
      cakes: demoCakes,
      pagination: {
        page: 1,
        limit: 12,
        total: 2,
        totalPages: 1
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

    const body = await request.json()
    const validation = cakeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Return demo created cake
    const cake = {
      id: 'demo-new-cake',
      ...validation.data,
      bakerId: 'demo-baker-id',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(cake, { status: 201 })
  } catch (error) {
    console.error('Error creating cake listing:', error)
    return NextResponse.json(
      { error: 'Failed to create cake listing' },
      { status: 500 }
    )
  }
}