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
    const { postId, title, content, category, published } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const post = await prisma.contentPage.update({
      where: { id: postId },
      data: {
        title,
        content,
        category,
        published
      }
    })

    return NextResponse.json({
      success: true,
      post
    })
  } catch (error: any) {
    console.error('Content update error:', error)
    return NextResponse.json(
      { error: 'Failed to update post', details: error.message },
      { status: 500 }
    )
  }
}
