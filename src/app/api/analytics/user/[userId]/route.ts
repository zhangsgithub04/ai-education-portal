import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserInterest from '@/models/UserInterest'
import ContentAnalysis from '@/models/ContentAnalysis'
import Blog from '@/models/Blog'
import Portfolio from '@/models/Portfolio'
import LLMAnalysisService from '@/lib/llm-analysis'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

// GET /api/analytics/user/[userId] - Get user interest analysis
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    const { userId } = await context.params
    
    // Users can only access their own analytics (or admin can access all)
    if (user.id !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if analysis already exists and is recent (less than 7 days old)
    const existingAnalysis = await UserInterest.findOne({ userId })
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    if (existingAnalysis && existingAnalysis.lastAnalyzed > oneWeekAgo) {
      return NextResponse.json({ success: true, data: existingAnalysis })
    }

    // Generate new analysis
    const analysisResult = await analyzeUserInterests(userId)
    
    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error('Error fetching user analysis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user analysis' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/user/[userId] - Trigger user interest analysis
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    const { userId } = await context.params
    
    // Users can only analyze their own data
    if (user.id !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Force refresh analysis
    const analysisResult = await analyzeUserInterests(userId, true)
    
    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error('Error analyzing user interests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze user interests' },
      { status: 500 }
    )
  }
}

async function analyzeUserInterests(userId: string, forceRefresh = false) {
  try {
    // Get user's content creation history
    const userBlogs = await Blog.find({ authorId: userId }).select('title content tags createdAt')
    const userPortfolios = await Portfolio.find({ authorId: userId }).select('title content technologies createdAt')
    const userContentAnalyses = await ContentAnalysis.find({ authorId: userId })

    // Get user's basic info (you might want to get this from User model)
    const userName = userBlogs[0]?.author || userPortfolios[0]?.author || 'Unknown User'
    const userEmail = 'user@example.com' // You'd get this from User model

    // Simulate reading behavior data (in a real app, you'd track this)
    const contentHistory = [
      ...userContentAnalyses.map(analysis => ({
        title: analysis.title,
        content: analysis.summary,
        timeSpent: analysis.readingTimeMinutes,
        completed: true,
        categories: analysis.categories,
        sentiment: analysis.sentiment.overall
      }))
    ]

    const createdContent = [
      ...userBlogs.map(blog => ({
        title: blog.title,
        content: blog.content,
        categories: blog.tags || []
      })),
      ...userPortfolios.map(portfolio => ({
        title: portfolio.title,
        content: portfolio.content,
        categories: portfolio.technologies || []
      }))
    ]

    // Use LLM to analyze user interests
    const llmService = LLMAnalysisService.getInstance()
    const analysis = await llmService.analyzeUserInterests({
      userId,
      userName,
      userEmail,
      contentHistory,
      createdContent
    })

    // Calculate additional metrics
    const totalContentViewed = contentHistory.length
    const totalReadingTime = contentHistory.reduce((sum, item) => sum + item.timeSpent, 0)
    const uniqueTopicsExplored = new Set(contentHistory.flatMap(item => item.categories)).size

    // Prepare user interest data
    const userInterestData = {
      userId,
      userName,
      userEmail,
      interests: analysis.interests,
      readingBehavior: {
        averageReadingTime: totalReadingTime / Math.max(contentHistory.length, 1),
        preferredComplexity: analysis.readingBehavior.preferredComplexity,
        mostActiveTimeOfDay: 'afternoon', // This would be calculated from actual data
        readingFrequency: contentHistory.length / 4, // per week (assuming 4 week period)
        completionRate: contentHistory.filter(item => item.completed).length / Math.max(contentHistory.length, 1)
      },
      contentPreferences: {
        favoriteAuthors: [], // Would be calculated from reading history
        preferredContentLength: 'medium',
        topCategories: analysis.interests.slice(0, 5).map(interest => interest.category),
        engagementScore: analysis.readingBehavior.engagementScore
      },
      sentimentProfile: analysis.sentimentProfile,
      recommendations: analysis.recommendations,
      analytics: {
        totalContentViewed,
        totalReadingTimeMinutes: totalReadingTime,
        uniqueTopicsExplored,
        knowledgeGrowthScore: Math.min(uniqueTopicsExplored / 10, 1), // Simple growth calculation
        communityEngagement: createdContent.length > 0 ? 0.8 : 0.3
      },
      aiInsights: analysis.aiInsights,
      lastAnalyzed: new Date(),
      modelVersion: '1.0'
    }

    // Save or update user interest analysis
    const result = await UserInterest.findOneAndUpdate(
      { userId },
      userInterestData,
      { upsert: true, new: true }
    )

    return result
  } catch (error) {
    console.error('Error in analyzeUserInterests:', error)
    throw error
  }
}