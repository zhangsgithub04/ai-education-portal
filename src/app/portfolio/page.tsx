"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Portfolio {
  _id: string
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
  slug: string
  createdAt: string
  updatedAt: string
}

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      
      if (data.success) {
        setPortfolios(data.portfolios)
      } else {
        setError("Failed to load portfolios")
      }
    } catch (err) {
      setError("An error occurred while loading portfolios")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolios...</p>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Showcase</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing projects and innovations created by our AI education community members.
          </p>
          
          {session && (
            <div className="mt-8">
              <Link href="/portfolio/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create New Portfolio Project
                </Button>
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No portfolio projects yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your amazing AI project with the community!</p>
            {session && (
              <Link href="/portfolio/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Your First Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio) => (
              <Card key={portfolio._id} className="hover:shadow-lg transition-shadow duration-200">
                {portfolio.imageUrl && (
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link href={`/portfolio/${portfolio.slug}`} className="hover:text-blue-600 transition-colors">
                          {portfolio.title}
                        </Link>
                      </h3>
                      {portfolio.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{portfolio.description}</p>
                </CardHeader>
                
                <CardContent>
                  {/* Technologies */}
                  {portfolio.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {portfolio.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {portfolio.technologies.length > 3 && (
                          <span className="inline-block text-gray-500 text-xs px-2 py-1">
                            +{portfolio.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Links */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {portfolio.projectUrl && (
                        <a
                          href={portfolio.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Project →
                        </a>
                      )}
                      {portfolio.githubUrl && (
                        <a
                          href={portfolio.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      by {portfolio.author}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}