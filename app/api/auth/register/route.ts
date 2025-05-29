import { NextResponse } from 'next/server'
import { z } from 'zod'

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
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { email, password, role } = validation.data

    // For demo purposes, simulate user creation
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email,
      role,
      createdAt: new Date().toISOString(),
      verificationStatus: 'UNVERIFIED'
    }

    return NextResponse.json(
      { 
        message: 'User created successfully (demo mode)',
        user: demoUser 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}