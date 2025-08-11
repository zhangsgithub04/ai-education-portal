"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Portfolio {
  _id: string
  title: string
  description: string
  author: string
  authorId: string
  slug: string
  featured: boolean
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userPortfolios, setUserPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState("")
  const [resetError, setResetError] = useState("")

  // Redirect if not authenticated
  if (status === "loading") {
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
    router.push("/auth/signin?callbackUrl=/profile")
    return null
  }

  useEffect(() => {
    if (session?.user?.email) {
      setResetEmail(session.user.email)
      fetchUserPortfolios()
    }
  }, [session])

  const fetchUserPortfolios = async () => {
    try {
      // Since we don't have a user-specific endpoint, we'll fetch all and filter
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      
      if (data.success) {
        const userProjects = data.portfolios.filter(
          (portfolio: Portfolio) => portfolio.author === session?.user?.name
        )
        setUserPortfolios(userProjects)
      }
    } catch (error) {
      console.error("Error fetching user portfolios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setResetMessage("")
    setResetError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setResetMessage(data.message)
        setShowPasswordReset(false)
      } else {
        setResetError(data.error || "Failed to send password reset email")
      }
    } catch (error) {
      setResetError("An error occurred while sending password reset email")
    } finally {
      setResetLoading(false)
    }
  }

  const joinDate = 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and portfolio projects</p>
        </div>

        {resetMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {resetMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || "User"}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {session.user?.name}
                    </h3>
                    <p className="text-gray-600">{session.user?.email}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Member since</dt>
                      <dd className="text-sm text-gray-900">{joinDate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Portfolio projects</dt>
                      <dd className="text-sm text-gray-900">{userPortfolios.length}</dd>
                    </div>
                  </dl>
                </div>

                {/* Password Reset Section */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Security</h4>
                  
                  {!showPasswordReset ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordReset(true)}
                      className="w-full"
                    >
                      Reset Password
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <form onSubmit={handlePasswordReset} className="space-y-3">
                        <div>
                          <label htmlFor="resetEmail" className="block text-xs font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="resetEmail"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        
                        {resetError && (
                          <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">
                            {resetError}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            type="submit"
                            disabled={resetLoading}
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {resetLoading ? "Sending..." : "Send Reset Link"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowPasswordReset(false)
                              setResetError("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Portfolio Projects</h2>
                  <Link href="/portfolio/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create New Project
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your projects...</p>
                  </div>
                ) : userPortfolios.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio projects yet</h3>
                    <p className="text-gray-600 mb-4">Create your first project to showcase your work!</p>
                    <Link href="/portfolio/new">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Your First Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPortfolios.map((portfolio) => (
                      <div key={portfolio._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Link href={`/portfolio/${portfolio.slug}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
                                {portfolio.title}
                              </Link>
                              {portfolio.featured && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{portfolio.description}</p>
                            <p className="text-xs text-gray-500">
                              Created {new Date(portfolio.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Link href={`/portfolio/${portfolio.slug}/edit`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}