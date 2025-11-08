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
    const { postId, published } = body

    if (!postId || typeof published !== 'boolean') {
      return NextResponse.json(
        { error: 'Post ID and published status are required' },
        { status: 400 }
      )
    }

    const post = await prisma.contentPage.update({
      where: { id: postId },
      data: { published }
    })

    return NextResponse.json({
      success: true,
      post
    })
  } catch (error: any) {
    console.error('Toggle publish error:', error)
    return NextResponse.json(
      { error: 'Failed to update publish status', details: error.message },
      { status: 500 }
    )
  }
}
