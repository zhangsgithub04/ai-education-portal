import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function Navigation() {
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
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Course Active • Spring 2025
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  )
}