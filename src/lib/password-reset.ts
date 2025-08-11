import crypto from 'crypto'

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateSecureToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36)
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
  
  // For development, we'll just log the reset URL
  // In production, you'd integrate with an email service like SendGrid, Resend, etc.
  console.log(`
  =====================================
  PASSWORD RESET REQUEST
  =====================================
  Email: ${email}
  Reset URL: ${resetUrl}
  
  Click the link above to reset your password.
  This link will expire in 1 hour.
  =====================================
  `)
  
  // TODO: Replace with actual email sending logic
  // Example with Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Reset Your Password - AI Education Portal',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password for AI Education Portal.</p>
      <p><a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `
  })
  */
  
  return true
}