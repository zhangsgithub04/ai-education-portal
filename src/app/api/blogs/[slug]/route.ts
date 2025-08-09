import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'

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
    await dbConnect()
    const { slug } = await context.params
    
    const body = await request.json()
    const { title, content, author, tags, published } = body
    
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { title, content, author, tags, published },
      { new: true, runValidators: true }
    )
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
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
    await dbConnect()
    const { slug } = await context.params
    
    const blog = await Blog.findOneAndDelete({ slug })
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}