import OpenAI from 'openai'

// Initialize OpenAI client (you can also use Anthropic/Claude)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export interface ContentAnalysisResult {
  summary: string
  keyTopics: string[]
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral'
    score: number
    confidence: number
  }
  complexity: {
    level: 'beginner' | 'intermediate' | 'advanced'
    score: number
    readabilityScore: number
  }
  categories: string[]
  extractedConcepts: {
    concept: string
    relevance: number
    category: string
  }[]
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
}

export interface UserInterestAnalysis {
  interests: {
    topic: string
    category: string
    weight: number
    confidence: number
  }[]
  readingBehavior: {
    preferredComplexity: 'beginner' | 'intermediate' | 'advanced'
    engagementScore: number
  }
  sentimentProfile: {
    positiveContentAffinity: number
    technicalContentPreference: number
    diversityScore: number
  }
  recommendations: {
    suggestedTopics: string[]
    recommendedAuthors: string[]
    nextReadingLevel: string
    personalizedTags: string[]
  }
  aiInsights: {
    learningStyle: string
    knowledgeAreas: string[]
    skillLevel: string
    recommendedPath: string[]
    personalityTraits: string[]
  }
}

export interface CommunityAnalysisResult {
  topicTrends: {
    topic: string
    category: string
    frequency: number
    growthRate: number
    sentiment: 'positive' | 'negative' | 'neutral'
  }[]
  sentimentAnalysis: {
    overall: {
      positive: number
      negative: number
      neutral: number
      averageScore: number
    }
    trending: 'improving' | 'declining' | 'stable'
  }
  insights: {
    topGrowingTopics: string[]
    decliningTopics: string[]
    contentGaps: string[]
    recommendedFocusAreas: string[]
    communityHealthScore: number
  }
  predictions: {
    nextTrendingTopics: string[]
    expectedGrowthAreas: string[]
    opportunities: string[]
  }
}

export class LLMAnalysisService {
  private static instance: LLMAnalysisService
  private modelVersion = '1.0'

  static getInstance(): LLMAnalysisService {
    if (!LLMAnalysisService.instance) {
      LLMAnalysisService.instance = new LLMAnalysisService()
    }
    return LLMAnalysisService.instance
  }

  /**
   * Analyze individual content (blog post or portfolio)
   */
  async analyzeContent(content: {
    title: string
    body: string
    author: string
    contentType: 'blog' | 'portfolio'
  }): Promise<ContentAnalysisResult> {
    try {
      const prompt = this.buildContentAnalysisPrompt(content)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective model for analysis
        messages: [
          {
            role: 'system',
            content: 'You are an expert content analyst specializing in AI and education content. Provide detailed, accurate analysis in the requested JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent analysis
        max_tokens: 2000
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from LLM')
      }

      return this.parseContentAnalysis(result, content)
    } catch (error) {
      console.error('Error analyzing content:', error)
      return this.getFallbackContentAnalysis(content)
    }
  }

  /**
   * Analyze user interests based on their content interaction history
   */
  async analyzeUserInterests(userData: {
    userId: string
    userName: string
    userEmail: string
    contentHistory: {
      title: string
      content: string
      timeSpent: number
      completed: boolean
      categories: string[]
      sentiment: string
    }[]
    createdContent: {
      title: string
      content: string
      categories: string[]
    }[]
  }): Promise<UserInterestAnalysis> {
    try {
      const prompt = this.buildUserInterestPrompt(userData)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in educational psychology and learning analytics. Analyze user behavior patterns to provide personalized insights and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from LLM')
      }

      return this.parseUserInterestAnalysis(result)
    } catch (error) {
      console.error('Error analyzing user interests:', error)
      return this.getFallbackUserAnalysis()
    }
  }

  /**
   * Analyze community-wide trends and patterns
   */
  async analyzeCommunityTrends(communityData: {
    posts: {
      title: string
      content: string
      author: string
      createdAt: Date
      categories: string[]
      sentiment?: string
    }[]
    timeRange: {
      start: Date
      end: Date
    }
    previousPeriodData?: any
  }): Promise<CommunityAnalysisResult> {
    try {
      const prompt = this.buildCommunityAnalysisPrompt(communityData)
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a community analytics expert specializing in educational content trends, sentiment analysis, and growth predictions. Provide actionable insights for community growth and engagement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        throw new Error('No response from LLM')
      }

      return this.parseCommunityAnalysis(result)
    } catch (error) {
      console.error('Error analyzing community trends:', error)
      return this.getFallbackCommunityAnalysis()
    }
  }

  private buildContentAnalysisPrompt(content: {
    title: string
    body: string
    author: string
    contentType: 'blog' | 'portfolio'
  }): string {
    return `
Analyze the following ${content.contentType} content and provide a comprehensive analysis:

Title: "${content.title}"
Author: ${content.author}
Content: "${content.body.substring(0, 3000)}..."

Please provide your analysis in the following JSON format:
{
  "summary": "A concise 2-3 sentence summary of the main points",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "sentiment": {
    "overall": "positive|negative|neutral",
    "score": 0.5,
    "confidence": 0.8
  },
  "complexity": {
    "level": "beginner|intermediate|advanced",
    "score": 6,
    "readabilityScore": 7.2
  },
  "categories": ["AI", "Education", "Machine Learning"],
  "extractedConcepts": [
    {
      "concept": "Neural Networks",
      "relevance": 0.9,
      "category": "Technical"
    }
  ],
  "languageMetrics": {
    "technicalTerms": 15,
    "averageSentenceLength": 18.5,
    "vocabularyRichness": 0.7
  },
  "aiInsights": {
    "mainTheme": "Main theme of the content",
    "targetAudience": ["Students", "Researchers", "Practitioners"],
    "recommendedActions": ["action1", "action2"],
    "relatedTopics": ["topic1", "topic2"]
  }
}

Focus on AI and education related analysis. Be precise and provide actionable insights.
`
  }

  private buildUserInterestPrompt(userData: any): string {
    const contentSummary = userData.contentHistory.map((item: any) => 
      `Title: ${item.title}, Time Spent: ${item.timeSpent}min, Completed: ${item.completed}, Categories: ${item.categories.join(', ')}`
    ).join('\n')

    return `
Analyze this user's reading behavior and content creation to determine their interests and learning profile:

User: ${userData.userName}
Content History (${userData.contentHistory.length} items):
${contentSummary}

Created Content: ${userData.createdContent.length} items

Please provide analysis in JSON format:
{
  "interests": [
    {
      "topic": "Machine Learning",
      "category": "Technical",
      "weight": 0.8,
      "confidence": 0.9
    }
  ],
  "readingBehavior": {
    "preferredComplexity": "intermediate",
    "engagementScore": 0.7
  },
  "sentimentProfile": {
    "positiveContentAffinity": 0.6,
    "technicalContentPreference": 0.8,
    "diversityScore": 0.5
  },
  "recommendations": {
    "suggestedTopics": ["topic1", "topic2"],
    "recommendedAuthors": ["author1", "author2"],
    "nextReadingLevel": "advanced",
    "personalizedTags": ["tag1", "tag2"]
  },
  "aiInsights": {
    "learningStyle": "Visual learner with technical focus",
    "knowledgeAreas": ["AI", "Data Science"],
    "skillLevel": "Intermediate",
    "recommendedPath": ["step1", "step2"],
    "personalityTraits": ["analytical", "curious"]
  }
}
`
  }

  private buildCommunityAnalysisPrompt(communityData: any): string {
    const postSummaries = communityData.posts.slice(0, 20).map((post: any) => 
      `"${post.title}" by ${post.author} - Categories: ${post.categories.join(', ')}`
    ).join('\n')

    return `
Analyze this community's content trends and provide insights:

Time Period: ${communityData.timeRange.start.toDateString()} to ${communityData.timeRange.end.toDateString()}
Total Posts: ${communityData.posts.length}

Recent Posts Sample:
${postSummaries}

Provide analysis in JSON format:
{
  "topicTrends": [
    {
      "topic": "Machine Learning",
      "category": "Technical",
      "frequency": 15,
      "growthRate": 0.2,
      "sentiment": "positive"
    }
  ],
  "sentimentAnalysis": {
    "overall": {
      "positive": 60,
      "negative": 10,
      "neutral": 30,
      "averageScore": 0.3
    },
    "trending": "improving"
  },
  "insights": {
    "topGrowingTopics": ["topic1", "topic2"],
    "decliningTopics": ["topic3"],
    "contentGaps": ["gap1", "gap2"],
    "recommendedFocusAreas": ["area1", "area2"],
    "communityHealthScore": 0.8
  },
  "predictions": {
    "nextTrendingTopics": ["trend1", "trend2"],
    "expectedGrowthAreas": ["area1", "area2"],
    "opportunities": ["opportunity1", "opportunity2"]
  }
}
`
  }

  private parseContentAnalysis(llmResponse: string, content: any): ContentAnalysisResult {
    try {
      // Extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and clean the response
      return {
        summary: parsed.summary || 'Content analysis summary',
        keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [],
        sentiment: {
          overall: ['positive', 'negative', 'neutral'].includes(parsed.sentiment?.overall) 
            ? parsed.sentiment.overall : 'neutral',
          score: typeof parsed.sentiment?.score === 'number' ? parsed.sentiment.score : 0,
          confidence: typeof parsed.sentiment?.confidence === 'number' ? parsed.sentiment.confidence : 0.5
        },
        complexity: {
          level: ['beginner', 'intermediate', 'advanced'].includes(parsed.complexity?.level)
            ? parsed.complexity.level : 'intermediate',
          score: typeof parsed.complexity?.score === 'number' ? parsed.complexity.score : 5,
          readabilityScore: typeof parsed.complexity?.readabilityScore === 'number' ? parsed.complexity.readabilityScore : 5
        },
        categories: Array.isArray(parsed.categories) ? parsed.categories : ['General'],
        extractedConcepts: Array.isArray(parsed.extractedConcepts) ? parsed.extractedConcepts : [],
        languageMetrics: {
          technicalTerms: parsed.languageMetrics?.technicalTerms || 0,
          averageSentenceLength: parsed.languageMetrics?.averageSentenceLength || 15,
          vocabularyRichness: parsed.languageMetrics?.vocabularyRichness || 0.5
        },
        aiInsights: {
          mainTheme: parsed.aiInsights?.mainTheme || 'General content',
          targetAudience: Array.isArray(parsed.aiInsights?.targetAudience) ? parsed.aiInsights.targetAudience : ['General'],
          recommendedActions: Array.isArray(parsed.aiInsights?.recommendedActions) ? parsed.aiInsights.recommendedActions : [],
          relatedTopics: Array.isArray(parsed.aiInsights?.relatedTopics) ? parsed.aiInsights.relatedTopics : []
        }
      }
    } catch (error) {
      console.error('Error parsing LLM response:', error)
      return this.getFallbackContentAnalysis(content)
    }
  }

  private parseUserInterestAnalysis(llmResponse: string): UserInterestAnalysis {
    try {
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error parsing user interest analysis:', error)
      return this.getFallbackUserAnalysis()
    }
  }

  private parseCommunityAnalysis(llmResponse: string): CommunityAnalysisResult {
    try {
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error parsing community analysis:', error)
      return this.getFallbackCommunityAnalysis()
    }
  }

  private getFallbackContentAnalysis(content: any): ContentAnalysisResult {
    return {
      summary: `Analysis of "${content.title}" - Content covers educational topics with moderate complexity.`,
      keyTopics: ['AI', 'Education', 'Technology'],
      sentiment: { overall: 'neutral', score: 0, confidence: 0.5 },
      complexity: { level: 'intermediate', score: 5, readabilityScore: 5 },
      categories: ['General'],
      extractedConcepts: [],
      languageMetrics: { technicalTerms: 5, averageSentenceLength: 15, vocabularyRichness: 0.5 },
      aiInsights: {
        mainTheme: 'Educational content',
        targetAudience: ['Students'],
        recommendedActions: ['Review content'],
        relatedTopics: ['Learning']
      }
    }
  }

  private getFallbackUserAnalysis(): UserInterestAnalysis {
    return {
      interests: [{ topic: 'AI', category: 'Technology', weight: 0.5, confidence: 0.5 }],
      readingBehavior: { preferredComplexity: 'intermediate', engagementScore: 0.5 },
      sentimentProfile: { positiveContentAffinity: 0.5, technicalContentPreference: 0.5, diversityScore: 0.5 },
      recommendations: {
        suggestedTopics: ['Machine Learning'],
        recommendedAuthors: [],
        nextReadingLevel: 'intermediate',
        personalizedTags: ['AI']
      },
      aiInsights: {
        learningStyle: 'Balanced learner',
        knowledgeAreas: ['AI'],
        skillLevel: 'Intermediate',
        recommendedPath: ['Continue learning'],
        personalityTraits: ['curious']
      }
    }
  }

  private getFallbackCommunityAnalysis(): CommunityAnalysisResult {
    return {
      topicTrends: [{ topic: 'AI', category: 'Technology', frequency: 10, growthRate: 0, sentiment: 'neutral' }],
      sentimentAnalysis: {
        overall: { positive: 50, negative: 20, neutral: 30, averageScore: 0.15 },
        trending: 'stable'
      },
      insights: {
        topGrowingTopics: ['AI'],
        decliningTopics: [],
        contentGaps: ['Advanced tutorials'],
        recommendedFocusAreas: ['Community engagement'],
        communityHealthScore: 0.7
      },
      predictions: {
        nextTrendingTopics: ['Machine Learning'],
        expectedGrowthAreas: ['Education'],
        opportunities: ['More beginner content']
      }
    }
  }

  // Utility function to calculate basic metrics without LLM
  static calculateBasicMetrics(text: string) {
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const readingTime = Math.ceil(words / 200) // 200 words per minute average
    
    return {
      wordCount: words,
      sentenceCount: sentences,
      readingTimeMinutes: readingTime,
      averageSentenceLength: words / sentences || 0
    }
  }
}

export default LLMAnalysisService