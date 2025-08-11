import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import { getAuthenticatedUserServer } from '@/lib/auth-server'

// GET /api/portfolios - Get all portfolios
export async function GET() {
  try {
    await dbConnect()
    
    const portfolios = await Portfolio.find({ published: true })
      .sort({ featured: -1, createdAt: -1 })
      .lean()
    
    return NextResponse.json({ success: true, portfolios })
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

// POST /api/portfolios - Create new portfolio
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUserServer()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const body = await request.json()
    const { title, description, content, technologies, projectUrl, githubUrl, imageUrl, featured } = body

    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingPortfolio = await Portfolio.findOne({ slug })
    if (existingPortfolio) {
      return NextResponse.json(
        { success: false, error: 'A portfolio with this title already exists' },
        { status: 400 }
      )
    }

    const portfolio = new Portfolio({
      title,
      description,
      content,
      author: user.name,
      authorId: user.id,
      technologies: technologies || [],
      projectUrl,
      githubUrl,
      imageUrl,
      featured: featured || false,
      slug
    })

    await portfolio.save()

    return NextResponse.json({ success: true, portfolio }, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}