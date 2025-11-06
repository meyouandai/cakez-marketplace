import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { z } from 'zod'
import prisma from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

const inquirySchema = z.object({
  bakerProfileId: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  message: z.string().min(10),
  referralSource: z.string().optional(), // Track influencer source
})

// POST /api/inquiries - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = inquirySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Verify baker profile exists
    const bakerProfile = await prisma.bakerProfile.findUnique({
      where: { id: validation.data.bakerProfileId }
    })

    if (!bakerProfile) {
      return NextResponse.json(
        { error: 'Baker not found' },
        { status: 404 }
      )
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        customerId: session.user.id,
        bakerProfileId: validation.data.bakerProfileId,
        customerName: validation.data.customerName,
        customerEmail: validation.data.customerEmail,
        customerPhone: validation.data.customerPhone,
        message: validation.data.message,
        referralSource: validation.data.referralSource,
      },
      include: {
        baker: {
          select: {
            businessName: true,
            location: true,
          }
        }
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}

// GET /api/inquiries - Get inquiries (for bakers to see their inquiries)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let inquiries

    if (session.user.role === 'BAKER') {
      // Get baker's profile
      const bakerProfile = await prisma.bakerProfile.findUnique({
        where: { userId: session.user.id }
      })

      if (!bakerProfile) {
        return NextResponse.json(
          { error: 'Baker profile not found' },
          { status: 404 }
        )
      }

      // Build where clause
      const where: any = {
        bakerProfileId: bakerProfile.id
      }

      if (status) {
        where.status = status
      }

      // Get inquiries for this baker
      inquiries = await prisma.inquiry.findMany({
        where,
        include: {
          customer: {
            select: {
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Get customer's inquiries
      inquiries = await prisma.inquiry.findMany({
        where: {
          customerId: session.user.id
        },
        include: {
          baker: {
            select: {
              businessName: true,
              location: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
