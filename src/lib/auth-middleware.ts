import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return null
    }
    
    // Check for userId from our custom token structure
    const userId = token.userId || token.sub
    if (!userId) {
      return null
    }
    
    return {
      id: userId,
      email: token.email as string,
      name: token.name as string,
      role: (token.role as string) || 'user'
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return null
  }
}

export function createAuthenticatedResponse() {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Authentication required. Please sign in to create blog posts.' 
    }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}