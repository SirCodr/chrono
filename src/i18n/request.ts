// src/i18n/request.ts
import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE } from '@/lib/locales';

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value || DEFAULT_LOCALE;

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return {
      locale,
      messages
    };
  } catch (error) {
    // Si no existe el archivo, usa fallback al DEFAULT_LOCALE
    const fallbackMessages = (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default;
    return {
      locale: DEFAULT_LOCALE,
      messages: fallbackMessages
    };
  }
});