import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from '@/app/lib/prisma'
import { sendVerificationEmail } from '@/app/lib/email'

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['CUSTOMER', 'BAKER']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, password, role } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex')

    // Set token expiry to 24 hours from now
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpires: verificationExpires,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    // Send verification email (don't block on email sending)
    sendVerificationEmail(user.email, verificationToken).catch((error) => {
      console.error('Failed to send verification email:', error)
      // Don't fail registration if email fails
    })

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user,
        emailSent: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}