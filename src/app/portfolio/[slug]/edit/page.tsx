"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

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

interface EditPortfolioProps {
  params: Promise<{ slug: string }>
}

export default function EditPortfolio({ params }: EditPortfolioProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        const portfolio = data.portfolio
        setPortfolio(portfolio)
        setFormData({
          title: portfolio.title,
          description: portfolio.description,
          content: portfolio.content,
          technologies: portfolio.technologies.join(", "),
          projectUrl: portfolio.projectUrl || "",
          githubUrl: portfolio.githubUrl || "",
          imageUrl: portfolio.imageUrl || "",
          featured: portfolio.featured || false
        })
      } else {
        setError("Portfolio project not found")
      }
    } catch (err) {
      setError("An error occurred while loading the portfolio project")
    } finally {
      setLoading(false)
    }
  }

  // Redirect if not authenticated
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/portfolio")
    return null
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

  // Check if user owns this portfolio
  if (session.user?.id !== portfolio.authorId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-6">You can only edit your own portfolio projects.</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleContentChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      content: value || ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    if (!formData.title || !formData.description || !formData.content) {
      setError("Title, description, and content are required")
      setSaving(false)
      return
    }

    try {
      const technologiesArray = formData.technologies
        .split(",")
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      const response = await fetch(`/api/portfolios/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/portfolio/${data.portfolio.slug}`)
      } else {
        setError(data.error || "Failed to update portfolio project")
      }
    } catch (err) {
      setError("An error occurred while updating the portfolio project")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href={`/portfolio/${slug}`} className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Project
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Edit Portfolio Project</h1>
            <p className="text-gray-600">Update your project details and content</p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your project title"
                  maxLength={100}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your project (max 500 characters)"
                  maxLength={500}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, Python, TensorFlow, etc. (comma-separated)"
                />
              </div>

              {/* Project URL */}
              <div>
                <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Live Project URL
                </label>
                <input
                  type="url"
                  id="projectUrl"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-project.com"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/repository"
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Mark as featured project
                </label>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <MDEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    preview="edit"
                    height={400}
                    data-color-mode="light"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Use Markdown to format your project description, include images, code snippets, etc.
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href={`/portfolio/${slug}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}