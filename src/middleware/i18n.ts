// middleware.ts
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true
})