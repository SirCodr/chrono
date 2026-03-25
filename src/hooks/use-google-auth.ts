'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useGoogleAuth() {
  const { data: session, status } = useSession()
  const isSignedIn = status === 'authenticated'
  const isLoading = status === 'loading'

  const handleSignIn = () =>
    signIn('google', { callbackUrl: window.location.href })

  const handleSignOut = () =>
    signOut({ callbackUrl: window.location.href })

  return {
    session,
    isSignedIn,
    isLoading,
    user: session?.user,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }
}
