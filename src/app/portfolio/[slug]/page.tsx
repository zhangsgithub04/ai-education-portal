"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

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

interface PortfolioPageProps {
  params: Promise<{ slug: string }>
}

export default function PortfolioProject({ params }: PortfolioPageProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug)
      fetchPortfolio(slug)
    })
  }, [params])

  const fetchPortfolio = async (slug: string) => {
    try {
      const response = await fetch(`/api/portfolios/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setPortfolio(data.portfolio)
      } else {
        setError("Portfolio project not found")
      }
    } catch (err) {
      setError("An error occurred while loading the portfolio project")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!portfolio || !confirm("Are you sure you want to delete this portfolio project?")) {
      return
    }

    try {
      const response = await fetch(`/api/portfolios/${portfolio.slug}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        router.push("/portfolio")
      } else {
        setError(data.error || "Failed to delete portfolio project")
      }
    } catch (err) {
      setError("An error occurred while deleting the portfolio project")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Portfolio Project Not Found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/portfolio">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === portfolio.authorId
  const createdDate = new Date(portfolio.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/portfolio" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Portfolio
          </Link>
        </div>

        <article>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{portfolio.title}</h1>
                {portfolio.featured && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full mb-4">
                    ⭐ Featured Project
                  </span>
                )}
              </div>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <Link href={`/portfolio/${portfolio.slug}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
            
            <p className="text-xl text-gray-600 mb-6">{portfolio.description}</p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <span className="font-medium">By {portfolio.author}</span>
              </div>
              <div className="flex items-center">
                <span>Published on {createdDate}</span>
              </div>
            </div>
            
            {/* Technologies */}
            {portfolio.technologies.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {portfolio.technologies.map((tech, index) => (
                    <span key={index} className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Links */}
            <div className="flex flex-wrap gap-4 mb-8">
              {portfolio.projectUrl && (
                <a
                  href={portfolio.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live Project
                </a>
              )}
              
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
            </div>
          </div>
          
          {/* Project Image */}
          {portfolio.imageUrl && (
            <div className="mb-8">
              <img
                src={portfolio.imageUrl}
                alt={portfolio.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {portfolio.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}