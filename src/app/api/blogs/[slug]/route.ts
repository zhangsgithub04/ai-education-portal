import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await context.params
    
    const blog = await Blog.findOne({ slug, published: true })
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    const { slug } = await context.params
    
    // Find the existing blog first
    const existingBlog = await Blog.findOne({ slug })
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check if user owns this blog
    if (existingBlog.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this blog post' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { title, content, tags, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate new slug if title changed
    let newSlug = slug
    if (title !== existingBlog.title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if new slug already exists
      const slugExists = await Blog.findOne({ slug: newSlug, _id: { $ne: existingBlog._id } })
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A blog with this title already exists' },
          { status: 400 }
        )
      }
    }
    
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { 
        title, 
        content, 
        author: user.name,
        authorId: user.id,
        tags: tags || [], 
        published: published ?? true,
        slug: newSlug
      },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    const { slug } = await context.params
    
    // Find the existing blog first
    const existingBlog = await Blog.findOne({ slug })
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check if user owns this blog
    if (existingBlog.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this blog post' },
        { status: 403 }
      )
    }
    
    await Blog.findOneAndDelete({ slug })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}