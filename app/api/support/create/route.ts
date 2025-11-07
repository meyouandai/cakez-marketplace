import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subject, message } = body

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // Get all admin users
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'No admin users available. Please try again later.' },
        { status: 500 }
      )
    }

    // Create support conversation
    const conversation = await prisma.conversation.create({
      data: {
        type: 'SUPPORT',
        subject: subject,
        status: 'OPEN',
        participants: {
          create: [
            // Add the user creating the ticket
            {
              userId: session.user.id
            },
            // Add all admins
            ...admins.map(admin => ({
              userId: admin.id
            }))
          ]
        },
        messages: {
          create: {
            senderId: session.user.id,
            content: message
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      conversationId: conversation.id
    })
  } catch (error: any) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create support ticket', details: error.message },
      { status: 500 }
    )
  }
}
