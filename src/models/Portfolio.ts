import mongoose from 'mongoose'

export interface IPortfolio {
  _id?: string
  title: string
  description: string
  content: string
  author: string
  authorId: string
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  imageUrl?: string
  featured: boolean
  published: boolean
  slug: string
  createdAt: Date
  updatedAt: Date
}

const PortfolioSchema = new mongoose.Schema<IPortfolio>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required'],
    ref: 'User'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  projectUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes for better performance
PortfolioSchema.index({ slug: 1 })
PortfolioSchema.index({ authorId: 1 })
PortfolioSchema.index({ published: 1 })
PortfolioSchema.index({ featured: 1 })
PortfolioSchema.index({ createdAt: -1 })

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)