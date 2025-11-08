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
    const { enrollmentId } = await request.json()

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true
      }
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

    if (enrollment.completedAt) {
      return NextResponse.json(
        { error: 'Course already completed' },
        { status: 400 }
      )
    }

    // Mark as complete
    const updatedEnrollment = await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: 100,
        completedAt: new Date()
      }
    })

    // Create certification if course provides one
    if (enrollment.course.certificationLevel) {
      await prisma.certification.create({
        data: {
          userId: session.user.id,
          certificationType: enrollment.course.certificationLevel,
          issuedDate: new Date(),
          // Certificate expires in 2 years for hygiene courses
          expiresDate: enrollment.course.courseType === 'SAFEBAKE_HYGIENE'
            ? new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)
            : null
        }
      })
    }

    return NextResponse.json({ success: true, enrollment: updatedEnrollment })
  } catch (error) {
    console.error('Error marking course as complete:', error)
    return NextResponse.json(
      { error: 'Failed to mark course as complete' },
      { status: 500 }
    )
  }
}
