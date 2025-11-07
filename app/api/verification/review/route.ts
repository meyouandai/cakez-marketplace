import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { verificationId, status, adminId, reviewNotes } = body

    if (!verificationId || !status) {
      return NextResponse.json(
        { error: 'Verification ID and status are required' },
        { status: 400 }
      )
    }

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be VERIFIED or REJECTED' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      reviewedBy: adminId,
      reviewNotes: reviewNotes || null
    }

    if (status === 'VERIFIED') {
      updateData.verifiedDate = new Date()
    }

    const verification = await prisma.verification.update({
      where: { id: verificationId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      verification
    })
  } catch (error: any) {
    console.error('Verification review error:', error)
    return NextResponse.json(
      { error: 'Failed to review verification', details: error.message },
      { status: 500 }
    )
  }
}
