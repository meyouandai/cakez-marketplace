import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { enrollmentId, progress } = await request.json()

    if (!enrollmentId || progress === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: 'Progress must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    if (enrollment.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update progress
    const updatedEnrollment = await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { progress }
    })

    return NextResponse.json({ success: true, enrollment: updatedEnrollment })
  } catch (error) {
    console.error('Error updating course progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
