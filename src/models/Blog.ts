import mongoose from 'mongoose'

export interface IBlog {
  _id?: string
  title: string
  content: string
  author: string
  authorId: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  published: boolean
  slug: string
}

const BlogSchema = new mongoose.Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required'],
    ref: 'User'
  },
  tags: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
})

// Create slug from title before saving
BlogSchema.pre('save', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)