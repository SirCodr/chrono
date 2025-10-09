import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from '@/lib/locales';
import { NextRequest, NextResponse } from 'next/server';

export function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('locale')?.value as Locale | undefined;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) return cookieLocale;

  const headerLocale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] as Locale | undefined;
  if (headerLocale && SUPPORTED_LOCALES.includes(headerLocale)) return headerLocale;

  return DEFAULT_LOCALE;
}

export function setLocaleCookie(request: NextRequest, response: NextResponse): NextResponse {
  if (!request.cookies.get('locale')) {
    const locale = detectLocale(request);
    response.cookies.set('locale', locale, { path: '/' });
  }
  return response;
}

// Middleware modularizado
export function i18nMiddleware(request: NextRequest, response: NextResponse): NextResponse {
  return setLocaleCookie(request, response);
}