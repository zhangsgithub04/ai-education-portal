"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI in Education</h1>
              <p className="text-sm text-gray-500">Learning Portal</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Overview</Link>
            <Link href="/syllabus" className="text-gray-700 hover:text-blue-600 font-medium">Syllabus</Link>
            <Link href="/modules" className="text-gray-700 hover:text-blue-600 font-medium">Modules</Link>
            <Link href="/resources" className="text-gray-700 hover:text-blue-600 font-medium">Resources</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-blue-600 font-medium">Portfolio</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Course Active • Spring 2025
            </Badge>
            
            {status === "loading" ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}