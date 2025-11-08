import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    await prisma.contentPage.delete({
      where: { id: postId }
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error: any) {
    console.error('Content deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    )
  }
}
