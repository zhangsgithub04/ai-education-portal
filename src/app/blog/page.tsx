"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IBlog } from "@/models/Blog"

export default function Blog() {
  const { data: session } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingBlog, setDeletingBlog] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      const data = await response.json()

      if (data.success) {
        setBlogs(data.data)
      } else {
        setError("Failed to fetch blogs")
      }
    } catch (err) {
      setError("An error occurred while fetching blogs")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    // Remove markdown syntax for preview
    const plainText = content.replace(/[#*`_~\[\]()]/g, "")
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + "..."
  }

  const handleDelete = async (blog: IBlog) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setDeletingBlog(blog._id || blog.slug)
    try {
      const response = await fetch(`/api/blogs/${blog.slug}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        // Remove the deleted blog from the list
        setBlogs(prevBlogs => prevBlogs.filter(b => b.slug !== blog.slug))
      } else {
        setError(data.error || "Failed to delete blog post")
      }
    } catch (err) {
      setError("An error occurred while deleting the blog post")
    } finally {
      setDeletingBlog(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Education Blog</h1>
            <p className="text-xl text-gray-600">
              Insights, research, and discussions on AI in education
            </p>
          </div>
          <Link href="/blog/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Write New Post
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {blogs.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your insights!</p>
              <Link href="/blog/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Write First Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const isOwner = session?.user?.id === blog.authorId
            const isDeleting = deletingBlog === (blog._id || blog.slug)
            
            return (
              <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Link href={`/blog/${blog.slug}`} className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer pr-2">
                          {blog.title}
                        </h3>
                      </Link>
                      
                      {isOwner && (
                        <div className="flex space-x-1 flex-shrink-0">
                          <Link href={`/blog/${blog.slug}/edit`}>
                            <Button variant="outline" size="sm" className="px-2 py-1 text-xs">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(blog)}
                            disabled={isDeleting}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            {isDeleting ? "..." : "Del"}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{formatDate(blog.createdAt.toString())}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      {truncateContent(blog.content)}
                    </p>
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Link href={`/blog/${blog.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}