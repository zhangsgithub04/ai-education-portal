import mongoose from 'mongoose'

export interface IPasswordReset {
  _id?: string
  email: string
  token: string
  userId: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}

const PasswordResetSchema = new mongoose.Schema<IPasswordReset>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  token: {
    type: String,
    required: [true, 'Token is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for automatic cleanup of expired tokens
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Index for faster lookups
PasswordResetSchema.index({ token: 1 })
PasswordResetSchema.index({ email: 1 })

export default mongoose.models.PasswordReset || mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema)