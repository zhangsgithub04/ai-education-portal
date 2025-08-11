import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

// GET /api/portfolios/[slug] - Get single portfolio
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    await dbConnect()
    
    const portfolio = await Portfolio.findOne({ slug, published: true }).lean()
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

// PUT /api/portfolios/[slug] - Update portfolio
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

    const { slug } = await context.params
    await dbConnect()
    
    const portfolio = await Portfolio.findOne({ slug })
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Check if user owns this portfolio
    if (portfolio.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this portfolio' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, content, technologies, projectUrl, githubUrl, imageUrl, featured } = body

    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and content are required' },
        { status: 400 }
      )
    }

    // Update portfolio
    portfolio.title = title
    portfolio.description = description
    portfolio.content = content
    portfolio.technologies = technologies || []
    portfolio.projectUrl = projectUrl
    portfolio.githubUrl = githubUrl
    portfolio.imageUrl = imageUrl
    portfolio.featured = featured || false

    // Update slug if title changed
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (newSlug !== slug) {
      const existingPortfolio = await Portfolio.findOne({ slug: newSlug })
      if (existingPortfolio) {
        return NextResponse.json(
          { success: false, error: 'A portfolio with this title already exists' },
          { status: 400 }
        )
      }
      portfolio.slug = newSlug
    }

    await portfolio.save()

    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

// DELETE /api/portfolios/[slug] - Delete portfolio
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

    const { slug } = await context.params
    await dbConnect()
    
    const portfolio = await Portfolio.findOne({ slug })
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Check if user owns this portfolio
    if (portfolio.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this portfolio' },
        { status: 403 }
      )
    }

    await Portfolio.deleteOne({ slug })

    return NextResponse.json({ success: true, message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}