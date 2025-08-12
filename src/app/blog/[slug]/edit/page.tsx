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

interface Blog {
  _id: string
  title: string
  content: string
  author: string
  authorId: string
  tags: string[]
  published: boolean
  slug: string
  createdAt: string
  updatedAt: string
}

interface EditBlogProps {
  params: Promise<{ slug: string }>
}

export default function EditBlog({ params }: EditBlogProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    published: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug)
      fetchBlog(slug)
    })
  }, [params])

  const fetchBlog = async (slug: string) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        const blog = data.data
        setBlog(blog)
        setFormData({
          title: blog.title,
          content: blog.content,
          tags: blog.tags.join(", "),
          published: blog.published
        })
      } else {
        setError("Blog post not found")
      }
    } catch (err) {
      setError("An error occurred while loading the blog post")
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
    router.push("/auth/signin?callbackUrl=/blog")
    return null
  }

  if (error || !blog) {
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
            <h3 className="text-xl font-medium text-gray-900 mb-2">Blog Post Not Found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check if user owns this blog
  if (session.user?.id !== blog.authorId) {
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
            <p className="text-gray-600 mb-6">You can only edit your own blog posts.</p>
            <Link href="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.title || !formData.content) {
      setError("Title and content are required")
      setSaving(false)
      return
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: tagsArray,
          published: formData.published
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/blog/${data.data.slug}`)
      } else {
        setError(data.error || "Failed to update blog post")
      }
    } catch (err) {
      setError("An error occurred while updating the blog post")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href={`/blog/${slug}`} className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to Post
          </Link>
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600">Update your blog post content and settings</p>
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
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your blog post title"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI, Machine Learning, Deep Learning (comma-separated)"
                />
              </div>

              {/* Published */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish this blog post
                </label>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
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
                  Use Markdown to format your blog post. You can include headers, lists, code blocks, and more.
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href={`/blog/${slug}`}>
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