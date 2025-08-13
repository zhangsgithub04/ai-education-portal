"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserAnalytics {
  interests: {
    topic: string
    category: string
    weight: number
    confidence: number
  }[]
  readingBehavior: {
    averageReadingTime: number
    preferredComplexity: string
    readingFrequency: number
    completionRate: number
  }
  contentPreferences: {
    topCategories: string[]
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
  analytics: {
    totalContentViewed: number
    totalReadingTimeMinutes: number
    uniqueTopicsExplored: number
    knowledgeGrowthScore: number
    communityEngagement: number
  }
  aiInsights: {
    learningStyle: string
    knowledgeAreas: string[]
    skillLevel: string
    recommendedPath: string[]
    personalityTraits: string[]
  }
}

interface CommunityAnalytics {
  contentStats: {
    totalPosts: number
    totalPortfolios: number
    totalAuthors: number
    averageWordsPerPost: number
  }
  topicTrends: {
    topic: string
    category: string
    frequency: number
    growthRate: number
    sentiment: string
  }[]
  sentimentAnalysis: {
    overall: {
      positive: number
      negative: number
      neutral: number
      averageScore: number
    }
    trending: string
  }
  insights: {
    topGrowingTopics: string[]
    communityHealthScore: number
    recommendedFocusAreas: string[]
  }
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null)
  const [communityAnalytics, setCommunityAnalytics] = useState<CommunityAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal')

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/analytics")
    return null
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch user analytics
      const userResponse = await fetch(`/api/analytics/user/${session?.user?.id}`)
      const userData = await userResponse.json()
      
      if (userData.success) {
        setUserAnalytics(userData.data)
      }
      
      // Fetch community analytics
      const communityResponse = await fetch('/api/analytics/community?period=weekly&limit=1')
      const communityData = await communityResponse.json()
      
      if (communityData.success && communityData.data.length > 0) {
        setCommunityAnalytics(communityData.data[0])
      }
      
    } catch (err) {
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const triggerAnalysis = async () => {
    try {
      setAnalyzing(true)
      
      const response = await fetch(`/api/analytics/user/${session?.user?.id}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUserAnalytics(data.data)
      } else {
        setError(data.error || "Failed to generate analysis")
      }
    } catch (err) {
      setError("Failed to generate analysis")
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-green-600"
    if (score >= 0.4) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 0.7) return "bg-green-100"
    if (score >= 0.4) return "bg-yellow-100"
    return "bg-red-100"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Analytics</h1>
          <p className="text-xl text-gray-600">
            Discover your learning patterns, interests, and community insights powered by LLM analysis
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Personal Analytics
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'community'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Community Trends
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Personal Analytics Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-8">
            {!userAnalytics ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h3>
                  <p className="text-gray-600 mb-6">Generate your personalized learning analytics based on your content interaction and creation history.</p>
                  <Button
                    onClick={triggerAnalysis}
                    disabled={analyzing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {analyzing ? "Analyzing..." : "Generate My Analytics"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {userAnalytics.analytics.totalContentViewed}
                      </div>
                      <div className="text-sm text-gray-600">Content Viewed</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(userAnalytics.analytics.totalReadingTimeMinutes)}m
                      </div>
                      <div className="text-sm text-gray-600">Reading Time</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {userAnalytics.analytics.uniqueTopicsExplored}
                      </div>
                      <div className="text-sm text-gray-600">Topics Explored</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className={`text-2xl font-bold ${getScoreColor(userAnalytics.analytics.knowledgeGrowthScore)}`}>
                        {Math.round(userAnalytics.analytics.knowledgeGrowthScore * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Growth Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">🤖 AI Insights About You</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Learning Profile</h3>
                        <p className="text-sm text-gray-600 mb-2">Learning Style: <span className="font-medium">{userAnalytics.aiInsights.learningStyle}</span></p>
                        <p className="text-sm text-gray-600 mb-2">Skill Level: <span className="font-medium">{userAnalytics.aiInsights.skillLevel}</span></p>
                        <div className="flex flex-wrap gap-1">
                          {userAnalytics.aiInsights.personalityTraits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Knowledge Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {userAnalytics.aiInsights.knowledgeAreas.map((area, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interest Analysis */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">📊 Your Interest Profile</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userAnalytics.interests.slice(0, 6).map((interest, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="font-medium text-gray-900">{interest.topic}</div>
                            <Badge variant="outline" className="text-xs">
                              {interest.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${interest.weight * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.round(interest.weight * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">💡 Personalized Recommendations</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Suggested Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {userAnalytics.recommendations.suggestedTopics.map((topic, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Recommended Learning Path</h3>
                      <div className="space-y-2">
                        {userAnalytics.aiInsights.recommendedPath.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reading Behavior */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">📖 Reading Behavior Analysis</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(userAnalytics.readingBehavior.averageReadingTime)}m
                        </div>
                        <div className="text-sm text-gray-600">Avg. Reading Time</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {userAnalytics.readingBehavior.preferredComplexity}
                        </div>
                        <div className="text-sm text-gray-600">Preferred Level</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(userAnalytics.readingBehavior.completionRate * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Completion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Refresh Analytics */}
                <div className="text-center">
                  <Button
                    onClick={triggerAnalysis}
                    disabled={analyzing}
                    variant="outline"
                  >
                    {analyzing ? "Updating..." : "Update Analytics"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Community Analytics Tab */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            {!communityAnalytics ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Community Analytics Coming Soon</h3>
                  <p className="text-gray-600">Community trend analysis will be available once we have sufficient data.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Community Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {communityAnalytics.contentStats.totalPosts}
                      </div>
                      <div className="text-sm text-gray-600">Total Posts</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {communityAnalytics.contentStats.totalPortfolios}
                      </div>
                      <div className="text-sm text-gray-600">Portfolios</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {communityAnalytics.contentStats.totalAuthors}
                      </div>
                      <div className="text-sm text-gray-600">Active Authors</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className={`text-2xl font-bold ${getScoreColor(communityAnalytics.insights.communityHealthScore)}`}>
                        {Math.round(communityAnalytics.insights.communityHealthScore * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Health Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">🔥 Trending Topics</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {communityAnalytics.topicTrends.slice(0, 8).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="font-medium text-gray-900">{trend.topic}</div>
                            <Badge variant="outline" className="text-xs">
                              {trend.category}
                            </Badge>
                            <Badge 
                              className={`text-xs ${
                                trend.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                trend.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {trend.sentiment}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {trend.frequency} mentions
                            </span>
                            {trend.growthRate > 0 && (
                              <span className="text-xs text-green-600">
                                +{Math.round(trend.growthRate * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Sentiment */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">😊 Community Sentiment</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {communityAnalytics.sentimentAnalysis.overall.positive}%
                          </div>
                          <div className="text-sm text-gray-600">Positive</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">
                            {communityAnalytics.sentimentAnalysis.overall.neutral}%
                          </div>
                          <div className="text-sm text-gray-600">Neutral</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {communityAnalytics.sentimentAnalysis.overall.negative}%
                          </div>
                          <div className="text-sm text-gray-600">Negative</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge 
                          className={`${
                            communityAnalytics.sentimentAnalysis.trending === 'improving' ? 'bg-green-100 text-green-800' :
                            communityAnalytics.sentimentAnalysis.trending === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          Trend: {communityAnalytics.sentimentAnalysis.trending}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Insights */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900">🎯 Community Insights</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Growing Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {communityAnalytics.insights.topGrowingTopics.map((topic, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            📈 {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Recommended Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {communityAnalytics.insights.recommendedFocusAreas.map((area, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            🎯 {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}