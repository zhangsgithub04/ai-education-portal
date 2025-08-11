import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./mongodb"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await dbConnect()
          
          const user = await User.findOne({ email: credentials.email })
          
          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Always ensure we have user data in token for existing sessions
      if (token.email && !token.userId) {
        try {
          await dbConnect()
          const dbUser = await User.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
            token.userId = dbUser._id.toString()
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error)
        }
      }
      
      if (user) {
        // This runs when user signs in
        await dbConnect()
        
        let dbUser = await User.findOne({ email: user.email })
        
        // Create user if doesn't exist (for OAuth providers)
        if (!dbUser && account && account.provider !== 'credentials') {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
            role: 'user',
            emailVerified: new Date()
          })
        }
        
        if (dbUser) {
          token.role = dbUser.role
          token.userId = dbUser._id.toString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account }) {
      // Allow all sign-ins, user creation handled in jwt callback
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}