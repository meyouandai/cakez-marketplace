import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Unauthorized - Baker access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      userId,
      businessLicense,
      insurancePolicy,
      hygieneCertificate,
      idDocument,
      additionalInfo
    } = body

    if (!businessLicense && !insurancePolicy && !hygieneCertificate && !idDocument) {
      return NextResponse.json(
        { error: 'At least one verification document is required' },
        { status: 400 }
      )
    }

    // Check if verification already exists
    const existing = await prisma.verification.findUnique({
      where: { userId: session.user.id }
    })

    if (existing && existing.status === 'PENDING') {
      return NextResponse.json(
        { error: 'You already have a pending verification request' },
        { status: 400 }
      )
    }

    if (existing && existing.status === 'VERIFIED') {
      return NextResponse.json(
        { error: 'You are already verified' },
        { status: 400 }
      )
    }

    // Create or update verification record
    const verification = await prisma.verification.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        status: 'PENDING',
        submittedDate: new Date(),
        businessLicense: businessLicense || null,
        insurancePolicy: insurancePolicy || null,
        hygieneCertificate: hygieneCertificate || null,
        idDocument: idDocument || null,
        additionalInfo: additionalInfo || null
      },
      update: {
        status: 'PENDING',
        submittedDate: new Date(),
        businessLicense: businessLicense || null,
        insurancePolicy: insurancePolicy || null,
        hygieneCertificate: hygieneCertificate || null,
        idDocument: idDocument || null,
        additionalInfo: additionalInfo || null,
        reviewedBy: null,
        reviewNotes: null
      }
    })

    return NextResponse.json({
      success: true,
      verification
    })
  } catch (error: any) {
    console.error('Verification submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit verification', details: error.message },
      { status: 500 }
    )
  }
}
