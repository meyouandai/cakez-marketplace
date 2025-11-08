import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { designStorage } from '../../../lib/design-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const design = designStorage.get(params.id)

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 })
    }

    // Check if user owns this design
    if (design.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(design)

  } catch (error) {
    console.error('Design fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const design = designStorage.get(params.id)

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 })
    }

    if (design.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData = await request.json()

    const updatedDesign = {
      ...design,
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    designStorage.set(params.id, updatedDesign)

    return NextResponse.json(updatedDesign)

  } catch (error) {
    console.error('Design update error:', error)
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const design = designStorage.get(params.id)

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 })
    }

    if (design.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    designStorage.delete(params.id)

    return NextResponse.json({ message: 'Design deleted successfully' })

  } catch (error) {
    console.error('Design delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    )
  }
}
