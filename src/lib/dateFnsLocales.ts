import { enUS, es } from 'date-fns/locale'
import { DEFAULT_LOCALE } from './locales'
import { getLocale } from 'next-intl/server'

export const dateFnsLocales = {
  en: enUS,
  es,
} as const

export const getDateFnsLocale = async () => {
  const locale = await getLocale()

  return dateFnsLocales[locale as keyof typeof dateFnsLocales] ?? dateFnsLocales[DEFAULT_LOCALE]
}