import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import PasswordReset from '@/models/PasswordReset'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { token, password } = body
    
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    })
    
    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Find user
    const user = await User.findById(resetRecord.userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    })
    
    // Mark reset token as used
    await PasswordReset.findByIdAndUpdate(resetRecord._id, {
      used: true
    })
    
    // Invalidate all other reset tokens for this user
    await PasswordReset.updateMany(
      { userId: user._id.toString(), used: false },
      { used: true }
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now sign in with your new password.' 
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}