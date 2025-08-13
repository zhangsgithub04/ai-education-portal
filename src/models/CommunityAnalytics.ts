import mongoose from 'mongoose'

export interface ICommunityAnalytics {
  _id?: string
  period: 'daily' | 'weekly' | 'monthly'
  startDate: Date
  endDate: Date
  contentStats: {
    totalPosts: number
    totalPortfolios: number
    totalAuthors: number
    averageWordsPerPost: number
    totalWordCount: number
  }
  topicTrends: {
    topic: string
    category: string
    frequency: number
    growthRate: number // percentage change from previous period
    sentiment: 'positive' | 'negative' | 'neutral'
    averageEngagement: number
  }[]
  sentimentAnalysis: {
    overall: {
      positive: number // percentage
      negative: number
      neutral: number
      averageScore: number // -1 to 1
    }
    byCategory: {
      category: string
      positive: number
      negative: number
      neutral: number
      averageScore: number
    }[]
    trending: 'improving' | 'declining' | 'stable'
  }
  complexityDistribution: {
    beginner: number // percentage
    intermediate: number
    advanced: number
    averageScore: number // 1 to 10
  }
  authorInsights: {
    mostActiveAuthors: {
      name: string
      userId: string
      postsCount: number
      averageSentiment: number
      topTopics: string[]
    }[]
    emergingVoices: {
      name: string
      userId: string
      growthRate: number
      uniqueTopics: string[]
    }[]
  }
  communityEngagement: {
    averageReadingTime: number
    contentCompletionRate: number
    diversityIndex: number // 0 to 1, higher = more diverse topics
    knowledgeSharingScore: number // 0 to 1
  }
  insights: {
    topGrowingTopics: string[]
    decliningTopics: string[]
    contentGaps: string[]
    recommendedFocusAreas: string[]
    communityHealthScore: number // 0 to 1
  }
  predictions: {
    nextTrendingTopics: string[]
    expectedGrowthAreas: string[]
    riskFactors: string[]
    opportunities: string[]
  }
  generatedAt: Date
  modelVersion: string
  createdAt: Date
  updatedAt: Date
}

const CommunityAnalyticsSchema = new mongoose.Schema<ICommunityAnalytics>({
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  contentStats: {
    totalPosts: {
      type: Number,
      required: true
    },
    totalPortfolios: {
      type: Number,
      required: true
    },
    totalAuthors: {
      type: Number,
      required: true
    },
    averageWordsPerPost: {
      type: Number,
      required: true
    },
    totalWordCount: {
      type: Number,
      required: true
    }
  },
  topicTrends: [{
    topic: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    frequency: {
      type: Number,
      required: true
    },
    growthRate: {
      type: Number,
      required: true
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    averageEngagement: {
      type: Number,
      required: true
    }
  }],
  sentimentAnalysis: {
    overall: {
      positive: Number,
      negative: Number,
      neutral: Number,
      averageScore: Number
    },
    byCategory: [{
      category: String,
      positive: Number,
      negative: Number,
      neutral: Number,
      averageScore: Number
    }],
    trending: {
      type: String,
      enum: ['improving', 'declining', 'stable']
    }
  },
  complexityDistribution: {
    beginner: Number,
    intermediate: Number,
    advanced: Number,
    averageScore: Number
  },
  authorInsights: {
    mostActiveAuthors: [{
      name: String,
      userId: String,
      postsCount: Number,
      averageSentiment: Number,
      topTopics: [String]
    }],
    emergingVoices: [{
      name: String,
      userId: String,
      growthRate: Number,
      uniqueTopics: [String]
    }]
  },
  communityEngagement: {
    averageReadingTime: Number,
    contentCompletionRate: Number,
    diversityIndex: Number,
    knowledgeSharingScore: Number
  },
  insights: {
    topGrowingTopics: [String],
    decliningTopics: [String],
    contentGaps: [String],
    recommendedFocusAreas: [String],
    communityHealthScore: Number
  },
  predictions: {
    nextTrendingTopics: [String],
    expectedGrowthAreas: [String],
    riskFactors: [String],
    opportunities: [String]
  },
  generatedAt: {
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
CommunityAnalyticsSchema.index({ period: 1, startDate: -1 })
CommunityAnalyticsSchema.index({ generatedAt: -1 })
CommunityAnalyticsSchema.index({ 'topicTrends.topic': 1 })
CommunityAnalyticsSchema.index({ 'topicTrends.category': 1 })

export default mongoose.models.CommunityAnalytics || mongoose.model<ICommunityAnalytics>('CommunityAnalytics', CommunityAnalyticsSchema)