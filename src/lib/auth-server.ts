import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export async function getAuthenticatedUserServer() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return null
    }
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.role || 'user'
    }
  } catch (error) {
    console.error('Server auth error:', error)
    return null
  }
}