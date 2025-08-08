import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'

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
    await dbConnect()
    
    const body = await request.json()
    const { title, content, author, tags = [] } = body
    
    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and author are required' },
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
        author,
        tags,
        slug: newSlug,
        published: true
      })
      
      return NextResponse.json({ success: true, data: blog }, { status: 201 })
    }
    
    const blog = await Blog.create({
      title,
      content,
      author,
      tags,
      slug,
      published: true
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