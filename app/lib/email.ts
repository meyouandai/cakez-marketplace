import { Resend } from 'resend'

// Lazy initialization - only create Resend client when API key is available
let resend: Resend | null = null

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const resendClient = getResendClient()

    // If no Resend API key is configured, log the email instead
    if (!resendClient) {
      console.log('📧 Email would be sent (Resend not configured):')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('HTML:', html)
      return { success: true, message: 'Email logged (Resend not configured)' }
    }

    const { data, error } = await resendClient.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@cakez.co.uk',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Reset Your Password</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi there,</p>

          <p>We received a request to reset your password for your Cakez Marketplace account.</p>

          <p>Click the button below to reset your password:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #8b5cf6; word-break: break-all;">${resetUrl}</a>
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour for security reasons.
          </p>

          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Cakez Marketplace - Connecting Bakers with Customers<br>
            © ${new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Cakez Marketplace',
    html,
  })
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, verificationToken: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to Cakez! 🎉</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi there,</p>

          <p>Thanks for signing up for Cakez Marketplace! We're excited to have you join our community of bakers and cake lovers.</p>

          <p>To get started, please verify your email address by clicking the button below:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              Verify Email
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #8b5cf6; word-break: break-all;">${verificationUrl}</a>
          </p>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 24 hours for security reasons.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Cakez Marketplace - Connecting Bakers with Customers<br>
            © ${new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Cakez Marketplace',
    html,
  })
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderNumber: string
    cakeName: string
    totalAmount: number
    deliveryDate: string
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Order Confirmed! 🎂</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi there,</p>

          <p>Great news! Your order has been confirmed.</p>

          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #8b5cf6; margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Cake:</strong> ${orderDetails.cakeName}</p>
            <p><strong>Total:</strong> £${orderDetails.totalAmount.toFixed(2)}</p>
            <p><strong>Delivery Date:</strong> ${orderDetails.deliveryDate}</p>
          </div>

          <p>The baker will be in touch soon to confirm the details and arrange delivery.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/customer"
               style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              View Order
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; text-align: center;">
            Cakez Marketplace - Connecting Bakers with Customers<br>
            © ${new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${orderDetails.orderNumber}`,
    html,
  })
}
