'use client'

import { dateFnsLocales } from "@/lib/dateFnsLocales"
import { DEFAULT_LOCALE } from "@/lib/locales"
import { useLocale } from "next-intl"

export function useDateFnsLocale() {
  const locale = useLocale()
  
  return dateFnsLocales[locale as keyof typeof dateFnsLocales] ?? dateFnsLocales[DEFAULT_LOCALE]
}