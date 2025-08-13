import mongoose from 'mongoose'

export interface IUserInterest {
  _id?: string
  userId: string
  userName: string
  userEmail: string
  interests: {
    topic: string
    category: string
    weight: number // 0 to 1, higher = more interested
    confidence: number // 0 to 1
    sources: string[] // content IDs that contributed to this interest
    lastUpdated: Date
  }[]
  readingBehavior: {
    averageReadingTime: number
    preferredComplexity: 'beginner' | 'intermediate' | 'advanced'
    mostActiveTimeOfDay: string
    readingFrequency: number // posts per week
    completionRate: number // 0 to 1
  }
  contentPreferences: {
    favoriteAuthors: string[]
    preferredContentLength: 'short' | 'medium' | 'long'
    topCategories: string[]
    engagementScore: number // 0 to 1
  }
  sentimentProfile: {
    positiveContentAffinity: number // 0 to 1
    technicalContentPreference: number // 0 to 1
    diversityScore: number // 0 to 1, higher = more diverse interests
  }
  recommendations: {
    suggestedTopics: string[]
    recommendedAuthors: string[]
    nextReadingLevel: string
    personalizedTags: string[]
    lastGenerated: Date
  }
  analytics: {
    totalContentViewed: number
    totalReadingTimeMinutes: number
    uniqueTopicsExplored: number
    knowledgeGrowthScore: number // 0 to 1
    communityEngagement: number // 0 to 1
  }
  aiInsights: {
    learningStyle: string
    knowledgeAreas: string[]
    skillLevel: string
    recommendedPath: string[]
    personalityTraits: string[]
  }
  lastAnalyzed: Date
  modelVersion: string
  createdAt: Date
  updatedAt: Date
}

const UserInterestSchema = new mongoose.Schema<IUserInterest>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  interests: [{
    topic: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    sources: [String],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  readingBehavior: {
    averageReadingTime: {
      type: Number,
      default: 0
    },
    preferredComplexity: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    mostActiveTimeOfDay: String,
    readingFrequency: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  contentPreferences: {
    favoriteAuthors: [String],
    preferredContentLength: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'medium'
    },
    topCategories: [String],
    engagementScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  sentimentProfile: {
    positiveContentAffinity: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    technicalContentPreference: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    diversityScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  },
  recommendations: {
    suggestedTopics: [String],
    recommendedAuthors: [String],
    nextReadingLevel: String,
    personalizedTags: [String],
    lastGenerated: {
      type: Date,
      default: Date.now
    }
  },
  analytics: {
    totalContentViewed: {
      type: Number,
      default: 0
    },
    totalReadingTimeMinutes: {
      type: Number,
      default: 0
    },
    uniqueTopicsExplored: {
      type: Number,
      default: 0
    },
    knowledgeGrowthScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    communityEngagement: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  aiInsights: {
    learningStyle: String,
    knowledgeAreas: [String],
    skillLevel: String,
    recommendedPath: [String],
    personalityTraits: [String]
  },
  lastAnalyzed: {
    type: Date,
    default: Date.now
  },
  modelVersion: {
    type: String,
    required: true,
    default: '1.0'
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
UserInterestSchema.index({ userId: 1 }, { unique: true })
UserInterestSchema.index({ 'interests.topic': 1 })
UserInterestSchema.index({ 'interests.category': 1 })
UserInterestSchema.index({ 'contentPreferences.topCategories': 1 })
UserInterestSchema.index({ lastAnalyzed: -1 })

export default mongoose.models.UserInterest || mongoose.model<IUserInterest>('UserInterest', UserInterestSchema)