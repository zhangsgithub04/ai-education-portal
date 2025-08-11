# Authentication System Setup

## Overview
The blog now requires authentication for creating posts. Users can sign in with:
- **Email/Password** (manual registration and sign-in)
- **Forgot Password** functionality for account recovery

*Note: Third-party OAuth providers (Google/GitHub) are currently disabled but can be re-enabled if needed.*

## Quick Setup

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# Required
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your-mongodb-connection-string

# Optional OAuth Providers (but highly recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### 2. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

**Note**: OAuth providers are optional but highly recommended for better user experience. Email/password authentication works without them.

## OAuth Provider Setup

### Google OAuth (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" 
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth (Recommended)
1. Go to [GitHub Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App:
   - Application name: "AI Education Portal"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret to `.env.local`

## Features

### 🔐 **Authentication Flow**
- **Sign In**: `/auth/signin` - Multiple provider options
- **Sign Up**: `/auth/signup` - Email registration + OAuth
- **Protected Routes**: Blog creation requires authentication
- **Session Management**: Persistent login across browser sessions

### 👤 **User Management**
- **User Profiles**: Name, email, profile image
- **Role System**: User/Admin roles (extensible)
- **OAuth Integration**: Automatic account creation for OAuth users
- **Password Security**: bcrypt hashing for credentials

### 📝 **Blog Integration**
- **Author Attribution**: Posts automatically linked to authenticated user
- **Access Control**: Only authenticated users can create posts
- **Author Display**: Real names shown on blog posts
- **User Context**: Navigation shows current user status

## Pages & Components

### Authentication Pages
- `/auth/signin` - Sign in with multiple providers
- `/auth/signup` - Create new account
- API routes handle authentication logic

### Protected Features
- `/blog/new` - Create blog post (requires authentication)
- Blog creation API endpoints protected
- Navigation shows user status and logout option

## Database Models

### User Model
```typescript
{
  name: string
  email: string (unique)
  password?: string (hashed)
  image?: string
  provider: 'credentials' | 'google' | 'github'
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### Updated Blog Model
```typescript
{
  title: string
  content: string
  author: string        // Display name
  authorId: string      // User ID reference
  tags: string[]
  published: boolean
  slug: string (unique)
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: Built-in NextAuth protection
- **Route Protection**: Server-side authentication checks
- **Input Validation**: Sanitized user inputs
- **Environment Isolation**: Sensitive data in environment variables

## Development Testing

### Test User Creation
1. Start the app: `npm run dev`
2. Go to `/auth/signup`
3. Create test account or use OAuth providers
4. Navigate to `/blog/new` to test protected route

### OAuth Testing
- **Google**: Use personal Google account
- **GitHub**: Use personal GitHub account
- Both create user records automatically

## Production Deployment

### Environment Variables
Update these for production:
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=secure-random-string-for-production
```

### OAuth Redirect URLs
Update OAuth apps with production URLs:
- Google: `https://your-domain.com/api/auth/callback/google`
- GitHub: `https://your-domain.com/api/auth/callback/github`

## Usage Examples

### Check Authentication in Components
```typescript
import { useSession } from "next-auth/react"

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <Loading />
  if (!session) return <SignInPrompt />
  
  return <AuthenticatedContent user={session.user} />
}
```

### Protect API Routes
```typescript
import { getAuthenticatedUser } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  // Protected logic here
}
```

The authentication system is now fully functional and integrated with the blog platform! 🚀