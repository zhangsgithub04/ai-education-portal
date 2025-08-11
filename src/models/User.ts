import mongoose from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  image?: string
  provider?: string
  providerId?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
  emailVerified?: Date
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  image: {
    type: String
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials'
  },
  providerId: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  emailVerified: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for better query performance (email index already created by unique: true)
UserSchema.index({ provider: 1, providerId: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)