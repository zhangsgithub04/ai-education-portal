import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CommunityAnalytics from '@/models/CommunityAnalytics'
import ContentAnalysis from '@/models/ContentAnalysis'
import Blog from '@/models/Blog'
import Portfolio from '@/models/Portfolio'
import LLMAnalysisService from '@/lib/llm-analysis'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

// GET /api/analytics/community - Get community analytics
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' || 'weekly'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get recent community analytics
    const analytics = await CommunityAnalytics.find({ period })
      .sort({ generatedAt: -1 })
      .limit(limit)
    
    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    console.error('Error fetching community analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community analytics' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/community - Generate new community analytics
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    await dbConnect()
    
    const body = await request.json()
    const period = body.period as 'daily' | 'weekly' | 'monthly' || 'weekly'
    
    // Calculate date range based on period
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'daily':
        startDate.setDate(endDate.getDate() - 1)
        break
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1)
        break
    }

    // Generate community analytics
    const analytics = await generateCommunityAnalytics(period, startDate, endDate)
    
    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    console.error('Error generating community analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate community analytics' },
      { status: 500 }
    )
  }
}

async function generateCommunityAnalytics(
  period: 'daily' | 'weekly' | 'monthly', 
  startDate: Date, 
  endDate: Date
) {
  try {
    // Get all content in the period
    const blogs = await Blog.find({
      createdAt: { $gte: startDate, $lte: endDate },
      published: true
    }).populate('authorId', 'name')

    const portfolios = await Portfolio.find({
      createdAt: { $gte: startDate, $lte: endDate },
      published: true
    }).populate('authorId', 'name')

    // Get content analyses for the period
    const contentAnalyses = await ContentAnalysis.find({
      processedAt: { $gte: startDate, $lte: endDate }
    })

    // Prepare data for LLM analysis
    const allPosts = [
      ...blogs.map(blog => ({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        createdAt: blog.createdAt,
        categories: blog.tags || []
      })),
      ...portfolios.map(portfolio => ({
        title: portfolio.title,
        content: portfolio.content,
        author: portfolio.author,
        createdAt: portfolio.createdAt,
        categories: portfolio.technologies || []
      }))
    ]

    // Get unique authors
    const uniqueAuthors = new Set([
      ...blogs.map(b => b.authorId),
      ...portfolios.map(p => p.authorId)
    ])

    // Calculate basic content stats
    const contentStats = {
      totalPosts: blogs.length,
      totalPortfolios: portfolios.length,
      totalAuthors: uniqueAuthors.size,
      averageWordsPerPost: allPosts.reduce((sum, post) => {
        const wordCount = post.content.split(/\s+/).length
        return sum + wordCount
      }, 0) / Math.max(allPosts.length, 1),
      totalWordCount: allPosts.reduce((sum, post) => {
        return sum + post.content.split(/\s+/).length
      }, 0)
    }

    // Use LLM to analyze community trends
    const llmService = LLMAnalysisService.getInstance()
    const llmAnalysis = await llmService.analyzeCommunityTrends({
      posts: allPosts,
      timeRange: { start: startDate, end: endDate }
    })

    // Calculate sentiment distribution from content analyses
    const sentimentCounts = contentAnalyses.reduce((acc, analysis) => {
      acc[analysis.sentiment.overall] = (acc[analysis.sentiment.overall] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalAnalyses = contentAnalyses.length || 1
    const sentimentAnalysis = {
      overall: {
        positive: Math.round((sentimentCounts.positive || 0) / totalAnalyses * 100),
        negative: Math.round((sentimentCounts.negative || 0) / totalAnalyses * 100),
        neutral: Math.round((sentimentCounts.neutral || 0) / totalAnalyses * 100),
        averageScore: contentAnalyses.reduce((sum, analysis) => sum + analysis.sentiment.score, 0) / totalAnalyses
      },
      byCategory: [], // Would be calculated from detailed category analysis
      trending: llmAnalysis.sentimentAnalysis.trending
    }

    // Calculate complexity distribution
    const complexityCounts = contentAnalyses.reduce((acc, analysis) => {
      acc[analysis.complexity.level] = (acc[analysis.complexity.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const complexityDistribution = {
      beginner: Math.round((complexityCounts.beginner || 0) / totalAnalyses * 100),
      intermediate: Math.round((complexityCounts.intermediate || 0) / totalAnalyses * 100),
      advanced: Math.round((complexityCounts.advanced || 0) / totalAnalyses * 100),
      averageScore: contentAnalyses.reduce((sum, analysis) => sum + analysis.complexity.score, 0) / totalAnalyses
    }

    // Get author insights
    const authorStats = Array.from(uniqueAuthors).map(authorId => {
      const authorBlogs = blogs.filter(b => b.authorId === authorId)
      const authorPortfolios = portfolios.filter(p => p.authorId === authorId)
      const authorAnalyses = contentAnalyses.filter(a => a.authorId === authorId)
      
      return {
        userId: authorId,
        name: authorBlogs[0]?.author || authorPortfolios[0]?.author || 'Unknown',
        postsCount: authorBlogs.length + authorPortfolios.length,
        averageSentiment: authorAnalyses.reduce((sum, a) => sum + a.sentiment.score, 0) / Math.max(authorAnalyses.length, 1),
        topTopics: [...new Set([
          ...authorBlogs.flatMap(b => b.tags || []),
          ...authorPortfolios.flatMap(p => p.technologies || [])
        ])].slice(0, 3)
      }
    })

    const mostActiveAuthors = authorStats
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 5)
      .map(author => ({
        name: author.name,
        userId: author.userId,
        postsCount: author.postsCount,
        averageSentiment: author.averageSentiment,
        topTopics: author.topTopics
      }))

    // Community engagement metrics (simplified)
    const averageReadingTime = contentAnalyses.reduce((sum, analysis) => sum + analysis.readingTimeMinutes, 0) / totalAnalyses
    const communityEngagement = {
      averageReadingTime,
      contentCompletionRate: 0.75, // Would be calculated from actual user behavior
      diversityIndex: Math.min(uniqueAuthors.size / 10, 1), // Simple diversity calculation
      knowledgeSharingScore: Math.min(contentStats.totalPosts / 20, 1) // Based on content creation
    }

    // Create community analytics record
    const analyticsData = {
      period,
      startDate,
      endDate,
      contentStats,
      topicTrends: llmAnalysis.topicTrends,
      sentimentAnalysis,
      complexityDistribution,
      authorInsights: {
        mostActiveAuthors,
        emergingVoices: [] // Would be calculated based on growth metrics
      },
      communityEngagement,
      insights: llmAnalysis.insights,
      predictions: llmAnalysis.predictions,
      generatedAt: new Date(),
      modelVersion: '1.0'
    }

    // Save analytics
    const result = await CommunityAnalytics.create(analyticsData)
    
    return result
  } catch (error) {
    console.error('Error generating community analytics:', error)
    throw error
  }
}