'use client'

import { cn } from '@/lib/utils'
import type { SyncStatus } from '@/types/record'
import { CalendarCheck2, CalendarClock, CalendarX2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface GoogleCalendarSyncProps {
  status: SyncStatus
  className?: string
}

const config: Record<
  SyncStatus,
  { icon: React.ElementType; labelKey: string; classes: string }
> = {
  synced: {
    icon: CalendarCheck2,
    labelKey: 'googleCalendar.status.synced',
    classes:
      'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800',
  },
  pending: {
    icon: CalendarClock,
    labelKey: 'googleCalendar.status.pending',
    classes:
      'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800',
  },
  unsynced: {
    icon: CalendarX2,
    labelKey: 'googleCalendar.status.unsynced',
    classes:
      'text-muted-foreground bg-muted/40 border-border',
  },
}

export function GoogleCalendarSync({
  status,
  className,
}: GoogleCalendarSyncProps) {
  const t = useTranslations()
  const { icon: Icon, labelKey, classes } = config[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        classes,
        className
      )}
      aria-label={t(labelKey)}
    >
      <Icon className='h-3 w-3' aria-hidden='true' />
      {t(labelKey)}
    </span>
  )
}
