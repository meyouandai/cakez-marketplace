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
    const { subject, content } = body

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    // Get all active subscribers
    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { active: true },
      select: { email: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers to send to' },
        { status: 400 }
      )
    }

    // Create newsletter record
    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        sentAt: new Date()
      }
    })

    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    //
    // For now, we'll just log that we would send emails
    console.log('📧 Newsletter sent:', {
      id: newsletter.id,
      subject: newsletter.subject,
      recipients: subscribers.length,
      emails: subscribers.map(s => s.email)
    })

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    //
    // for (const subscriber of subscribers) {
    //   await sgMail.send({
    //     to: subscriber.email,
    //     from: 'newsletters@cakez.com',
    //     subject: subject,
    //     text: content,
    //     html: `<div>${content.replace(/\n/g, '<br>')}</div>`
    //   })
    // }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
      newsletterId: newsletter.id,
      recipientCount: subscribers.length
    })
  } catch (error: any) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: error.message },
      { status: 500 }
    )
  }
}
