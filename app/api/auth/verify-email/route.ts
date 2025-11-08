import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Hash the token to compare with stored value
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: {
          gt: new Date(), // Token hasn't expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationStatus: 'VERIFIED',
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'An error occurred verifying your email' },
      { status: 500 }
    )
  }
}

// GET endpoint for verify email page
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Verification token is required' },
      { status: 400 }
    )
  }

  // Redirect to POST with token
  return NextResponse.json({
    message: 'Use POST method to verify email',
  })
}
