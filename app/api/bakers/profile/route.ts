import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { z } from 'zod'
import prisma from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

const profileSchema = z.object({
  businessName: z.string().min(2),
  description: z.string().min(20),
  location: z.string().min(2),
  deliveryRadius: z.number().min(1).max(100),
})

// GET /api/bakers/profile - Get current baker's profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            cakeListings: true,
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found', hasProfile: false },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// POST /api/bakers/profile - Create baker profile
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if profile already exists
    const existingProfile = await prisma.bakerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 409 }
      )
    }

    const body = await request.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const profile = await prisma.bakerProfile.create({
      data: {
        userId: session.user.id,
        businessName: validation.data.businessName,
        description: validation.data.description,
        location: validation.data.location,
        deliveryRadius: validation.data.deliveryRadius,
      }
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

// PUT /api/bakers/profile - Update baker profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const profile = await prisma.bakerProfile.update({
      where: { userId: session.user.id },
      data: {
        businessName: validation.data.businessName,
        description: validation.data.description,
        location: validation.data.location,
        deliveryRadius: validation.data.deliveryRadius,
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}