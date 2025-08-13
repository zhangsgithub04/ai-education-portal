import mongoose from 'mongoose'

export interface IContentAnalysis {
  _id?: string
  contentId: string
  contentType: 'blog' | 'portfolio'
  title: string
  author: string
  authorId: string
  summary: string
  keyTopics: string[]
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral'
    score: number // -1 to 1
    confidence: number // 0 to 1
  }
  complexity: {
    level: 'beginner' | 'intermediate' | 'advanced'
    score: number // 1 to 10
    readabilityScore: number
  }
  categories: string[]
  extractedConcepts: {
    concept: string
    relevance: number // 0 to 1
    category: string
  }[]
  wordCount: number
  readingTimeMinutes: number
  languageMetrics: {
    technicalTerms: number
    averageSentenceLength: number
    vocabularyRichness: number
  }
  aiInsights: {
    mainTheme: string
    targetAudience: string[]
    recommendedActions: string[]
    relatedTopics: string[]
  }
  processedAt: Date
  modelVersion: string
  createdAt: Date
  updatedAt: Date
}

const ContentAnalysisSchema = new mongoose.Schema<IContentAnalysis>({
  contentId: {
    type: String,
    required: true,
    index: true
  },
  contentType: {
    type: String,
    enum: ['blog', 'portfolio'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true,
    index: true
  },
  summary: {
    type: String,
    required: true
  },
  keyTopics: [{
    type: String
  }],
  sentiment: {
    overall: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    score: {
      type: Number,
      min: -1,
      max: 1,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    }
  },
  complexity: {
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    score: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    readabilityScore: {
      type: Number,
      required: true
    }
  },
  categories: [{
    type: String
  }],
  extractedConcepts: [{
    concept: String,
    relevance: {
      type: Number,
      min: 0,
      max: 1
    },
    category: String
  }],
  wordCount: {
    type: Number,
    required: true
  },
  readingTimeMinutes: {
    type: Number,
    required: true
  },
  languageMetrics: {
    technicalTerms: Number,
    averageSentenceLength: Number,
    vocabularyRichness: Number
  },
  aiInsights: {
    mainTheme: String,
    targetAudience: [String],
    recommendedActions: [String],
    relatedTopics: [String]
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  modelVersion: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
ContentAnalysisSchema.index({ contentId: 1, contentType: 1 }, { unique: true })
ContentAnalysisSchema.index({ authorId: 1 })
ContentAnalysisSchema.index({ 'sentiment.overall': 1 })
ContentAnalysisSchema.index({ 'complexity.level': 1 })
ContentAnalysisSchema.index({ categories: 1 })
ContentAnalysisSchema.index({ keyTopics: 1 })
ContentAnalysisSchema.index({ processedAt: -1 })

export default mongoose.models.ContentAnalysis || mongoose.model<IContentAnalysis>('ContentAnalysis', ContentAnalysisSchema)