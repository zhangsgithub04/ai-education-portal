import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import PasswordReset from '@/models/PasswordReset'
import { generateSecureToken, sendPasswordResetEmail } from '@/lib/password-reset'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      })
    }
    
    // Only allow password reset for users who signed up with credentials (not OAuth)
    if (user.provider !== 'credentials') {
      return NextResponse.json({
        success: false,
        error: `This account uses ${user.provider} authentication. Please sign in with ${user.provider} instead.`
      }, { status: 400 })
    }
    
    // Check for existing unused reset token
    const existingToken = await PasswordReset.findOne({
      email: email.toLowerCase(),
      used: false,
      expiresAt: { $gt: new Date() }
    })
    
    if (existingToken) {
      return NextResponse.json({
        success: false,
        error: 'A password reset link has already been sent. Please check your email or wait 10 minutes before requesting another.'
      }, { status: 429 })
    }
    
    // Generate reset token
    const resetToken = generateSecureToken()
    
    // Save reset token to database
    await PasswordReset.create({
      email: email.toLowerCase(),
      token: resetToken,
      userId: user._id.toString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    })
    
    // Send reset email
    await sendPasswordResetEmail(email, resetToken)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password reset link has been sent to your email address.' 
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}