import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// @ts-expect-error Types for NextAuth might be misaligned in this beta version
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any, account: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
      session.accessToken = token.accessToken as string | undefined
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
})
