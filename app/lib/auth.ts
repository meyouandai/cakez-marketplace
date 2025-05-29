import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
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

        // For now, return a demo user to get the app working
        // In production, you would validate against your database
        if (credentials.email === "demo@cakez.com" && credentials.password === "demo123") {
          return {
            id: "demo-user-id",
            email: "demo@cakez.com",
            role: "BAKER",
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        }
      }
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: false,
}