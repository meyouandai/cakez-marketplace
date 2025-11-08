import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { designStorage } from '../../lib/design-storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const designData = await request.json()

    // Create design
    const design = {
      id: `design-${Date.now()}`,
      userId: session.user.id,
      userEmail: session.user.email,
      ...designData,
      createdAt: new Date().toISOString(),
      status: 'saved'
    }

    designStorage.set(design.id, design)

    console.log(`✅ Design saved for user ${session.user.id}:`, design.id)

    return NextResponse.json(design, { status: 201 })

  } catch (error) {
    console.error('Design save error:', error)
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's designs
    const userDesigns = designStorage.getUserDesigns(session.user.id)

    return NextResponse.json({
      designs: userDesigns.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })

  } catch (error) {
    console.error('Design fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    )
  }
}
