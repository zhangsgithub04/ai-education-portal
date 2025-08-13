import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getAuthenticatedUserServer } from '@/lib/auth-server'
import { triggerContentAnalysis } from '@/lib/auto-analysis'

export async function GET() {
  try {
    await dbConnect()
    
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(20)
    
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in to create blog posts.' },
        { status: 401 }
      )
    }
    
    await dbConnect()
    
    const body = await request.json()
    const { title, content, tags = [] } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug })
    if (existingBlog) {
      const timestamp = Date.now()
      const newSlug = `${slug}-${timestamp}`
      
      const blog = await Blog.create({
        title,
        content,
        author: user.name,
        authorId: user.id,
        tags,
        slug: newSlug,
        published: true
      })
      
      // Trigger automatic content analysis
      triggerContentAnalysis({
        id: blog._id.toString(),
        title: blog.title,
        body: blog.content,
        author: blog.author,
        authorId: blog.authorId,
        contentType: 'blog'
      })
      
      return NextResponse.json({ success: true, data: blog }, { status: 201 })
    }
    
    const blog = await Blog.create({
      title,
      content,
      author: user.name,
      authorId: user.id,
      tags,
      slug,
      published: true
    })
    
    // Trigger automatic content analysis
    triggerContentAnalysis({
      id: blog._id.toString(),
      title: blog.title,
      body: blog.content,
      author: blog.author,
      authorId: blog.authorId,
      contentType: 'blog'
    })
    
    return NextResponse.json({ success: true, data: blog }, { status: 201 })
  } catch (error) {
    console.error('Blog creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}