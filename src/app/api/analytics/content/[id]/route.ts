import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Portfolio from '@/models/Portfolio'
import ContentAnalysis from '@/models/ContentAnalysis'
import LLMAnalysisService from '@/lib/llm-analysis'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

// GET /api/analytics/content/[id] - Get analysis for specific content
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await context.params
    
    // Check if analysis already exists
    const existingAnalysis = await ContentAnalysis.findOne({ contentId: id })
    if (existingAnalysis) {
      return NextResponse.json({ success: true, data: existingAnalysis })
    }

    // If no analysis exists, create one
    const analysisResult = await analyzeContent(id)
    if (!analysisResult) {
      return NextResponse.json(
        { success: false, error: 'Content not found or analysis failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error('Error fetching content analysis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content analysis' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/content/[id] - Trigger analysis for specific content
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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
    const { id } = await context.params
    
    // Force re-analysis
    const analysisResult = await analyzeContent(id, true)
    if (!analysisResult) {
      return NextResponse.json(
        { success: false, error: 'Content not found or analysis failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error('Error analyzing content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}

async function analyzeContent(contentId: string, forceRefresh = false) {
  try {
    // Check for existing analysis if not forcing refresh
    if (!forceRefresh) {
      const existing = await ContentAnalysis.findOne({ contentId })
      if (existing) {
        return existing
      }
    }

    // Try to find content in blogs first
    let content = await Blog.findOne({ 
      $or: [{ _id: contentId }, { slug: contentId }] 
    })
    let contentType: 'blog' | 'portfolio' = 'blog'

    // If not found in blogs, try portfolios
    if (!content) {
      content = await Portfolio.findOne({ 
        $or: [{ _id: contentId }, { slug: contentId }] 
      })
      contentType = 'portfolio'
    }

    if (!content) {
      return null
    }

    // Get LLM analysis
    const llmService = LLMAnalysisService.getInstance()
    const analysis = await llmService.analyzeContent({
      title: content.title,
      body: content.content,
      author: content.author,
      contentType
    })

    // Calculate basic metrics
    const basicMetrics = LLMAnalysisService.calculateBasicMetrics(content.content)

    // Create or update analysis record
    const analysisData = {
      contentId: content._id?.toString() || content.slug,
      contentType,
      title: content.title,
      author: content.author,
      authorId: content.authorId,
      summary: analysis.summary,
      keyTopics: analysis.keyTopics,
      sentiment: analysis.sentiment,
      complexity: analysis.complexity,
      categories: analysis.categories,
      extractedConcepts: analysis.extractedConcepts,
      wordCount: basicMetrics.wordCount,
      readingTimeMinutes: basicMetrics.readingTimeMinutes,
      languageMetrics: {
        ...analysis.languageMetrics,
        averageSentenceLength: basicMetrics.averageSentenceLength
      },
      aiInsights: analysis.aiInsights,
      modelVersion: '1.0'
    }

    const result = await ContentAnalysis.findOneAndUpdate(
      { contentId: content._id?.toString() || content.slug },
      analysisData,
      { upsert: true, new: true }
    )

    return result
  } catch (error) {
    console.error('Error in analyzeContent:', error)
    return null
  }
}