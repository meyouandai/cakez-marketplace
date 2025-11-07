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
    const { title, content, category, published, authorId } = body

    if (!title || !content || !category || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const post = await prisma.contentPage.create({
      data: {
        title,
        content,
        category,
        published: published || false,
        authorId
      }
    })

    return NextResponse.json({
      success: true,
      post
    })
  } catch (error: any) {
    console.error('Content creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    )
  }
}
