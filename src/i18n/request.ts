import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales';

export default getRequestConfig(async () => {
  let locale = DEFAULT_LOCALE;

  try {
    const requestHeaders = await headers();
    const acceptLanguage = requestHeaders.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0];
      if (SUPPORTED_LOCALES.includes(preferred as any)) {
        locale = preferred as (typeof SUPPORTED_LOCALES)[number];
      }
    }
  } catch {
    // Se ejecuta en build time, sin request
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.ts`)).default,
  };
});
