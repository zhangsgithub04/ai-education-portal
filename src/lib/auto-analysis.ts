import LLMAnalysisService from './llm-analysis'
import ContentAnalysis from '@/models/ContentAnalysis'
import dbConnect from './mongodb'

export class AutoAnalysisService {
  private static instance: AutoAnalysisService
  
  static getInstance(): AutoAnalysisService {
    if (!AutoAnalysisService.instance) {
      AutoAnalysisService.instance = new AutoAnalysisService()
    }
    return AutoAnalysisService.instance
  }

  /**
   * Automatically analyze content when it's created or updated
   */
  async analyzeContentAsync(content: {
    id: string
    title: string
    body: string
    author: string
    authorId: string
    contentType: 'blog' | 'portfolio'
  }) {
    // Run analysis in background without blocking the main request
    setTimeout(async () => {
      try {
        await this.performAnalysis(content)
      } catch (error) {
        console.error('Background content analysis failed:', error)
      }
    }, 100) // Small delay to ensure the main content is saved first
  }

  private async performAnalysis(content: {
    id: string
    title: string
    body: string
    author: string
    authorId: string
    contentType: 'blog' | 'portfolio'
  }) {
    try {
      await dbConnect()

      // Check if analysis already exists
      const existingAnalysis = await ContentAnalysis.findOne({ contentId: content.id })
      if (existingAnalysis) {
        return // Skip if already analyzed
      }

      // Get LLM analysis
      const llmService = LLMAnalysisService.getInstance()
      const analysis = await llmService.analyzeContent({
        title: content.title,
        body: content.body,
        author: content.author,
        contentType: content.contentType
      })

      // Calculate basic metrics
      const basicMetrics = LLMAnalysisService.calculateBasicMetrics(content.body)

      // Save analysis
      const analysisData = {
        contentId: content.id,
        contentType: content.contentType,
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

      await ContentAnalysis.create(analysisData)
      
      console.log(`Content analysis completed for: ${content.title}`)
    } catch (error) {
      console.error('Error performing content analysis:', error)
    }
  }

  /**
   * Batch analyze multiple pieces of content
   */
  async batchAnalyze(contents: Array<{
    id: string
    title: string
    body: string
    author: string
    authorId: string
    contentType: 'blog' | 'portfolio'
  }>) {
    const batchSize = 5 // Process 5 at a time to avoid overwhelming the API
    
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize)
      
      // Process batch in parallel
      const promises = batch.map(content => this.performAnalysis(content))
      
      try {
        await Promise.all(promises)
        console.log(`Batch ${Math.floor(i / batchSize) + 1} analysis completed`)
      } catch (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} analysis failed:`, error)
      }
      
      // Wait between batches to respect API rate limits
      if (i + batchSize < contents.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second delay
      }
    }
  }
}

// Utility function to trigger analysis from API routes
export async function triggerContentAnalysis(content: {
  id: string
  title: string
  body: string
  author: string
  authorId: string
  contentType: 'blog' | 'portfolio'
}) {
  const autoAnalysis = AutoAnalysisService.getInstance()
  await autoAnalysis.analyzeContentAsync(content)
}

export default AutoAnalysisService