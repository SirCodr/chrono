import type React from 'react'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from 'next-intl'
import { AuthProvider } from '@/components/auth-provider'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  title: 'Chrono - Timeline Management',
  description: 'Manage your chronological data with ease',
  generator: 'v0.app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = useLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
