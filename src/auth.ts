import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshGoogleAccessToken(token: any): Promise<any> {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    })

    const refreshed = await response.json()

    if (!response.ok) throw refreshed

    return {
      ...token,
      accessToken: refreshed.access_token,
      // Google may not always return a new refresh token; fall back to the existing one
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
      error: undefined,
    }
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: { token: any; account: any }) {
      // First sign-in: persist tokens from the provider
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        }
      }

      // Token still valid — return as-is (with a 60 s buffer)
      const bufferSeconds = 60
      if (Date.now() < (token.expiresAt as number) * 1000 - bufferSeconds * 1000) {
        return token
      }

      // Token expired — refresh it automatically
      return refreshGoogleAccessToken(token)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken as string | undefined
      session.error = token.error as string | undefined
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
})
