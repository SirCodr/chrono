import { createServerClient } from '@/lib/supabase/server'
import { TimelineItem } from './timeline-item'
import { Tables } from '@/lib/supabase/database.types'
import TimeLineEmptyState from './timeline-empty-state'
import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears, format, parseISO } from 'date-fns'
import { Calendar } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { getTranslations, getLocale } from 'next-intl/server'
import { getDateFnsLocale } from '@/lib/dateFnsLocales'

type Props = {
  filterParams: {
    from?: string
    to?: string
    search?: string
  }
}

export async function TimelineView({ filterParams }: Props) {
  const supabase = await createServerClient()
  const { userId } = await auth()
  const t = await getTranslations('timeline.activity')
  const dateLocale = await getDateFnsLocale()

  let query = supabase.from('records').select('*')

  if (filterParams?.from) {
    query = query.gte('date', filterParams.from as string)
  }
  if (filterParams?.to) {
    query = query.lte('date', filterParams.to as string)
  }
  if (filterParams?.search) {
    query = query.ilike('title', `%${filterParams.search}%`)
  }

  query = query.eq('user_id', userId)

  const { data: records } = await query.order('date', { ascending: false })
  const groupedRecords: Record<string, Tables<'records'>[]> = (records ?? []).reduce((groups, record) => {
    debugger
    const date = new Date(record.date)
    const dateKey = date.toISOString().split('T')[0]

    if (!groups[dateKey

    ]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(record)
    return groups
  }, {} as Record<string, Tables<'records'>[]>)

  const formatTimeDifference = (olderDate: Date, newerDate: Date) => {
    const normalizedOlderDate = new Date(olderDate.getFullYear(), olderDate.getMonth(), olderDate.getDate())
    const normalizedNewerDate = new Date(newerDate.getFullYear(), newerDate.getMonth(), newerDate.getDate())

    const days = differenceInDays(normalizedNewerDate, normalizedOlderDate)
    const weeks = differenceInWeeks(normalizedNewerDate, normalizedOlderDate)
    const months = differenceInMonths(normalizedNewerDate, normalizedOlderDate)
    const years = differenceInYears(normalizedNewerDate, normalizedOlderDate)

    if (years > 0) {
      return t('timeDifference.years', { count: years })
    } else if (months > 0) {
      return t('timeDifference.months', { count: months })
    } else if (weeks > 0) {
      return t('timeDifference.weeks', { count: weeks })
    } else if (days > 0) {
      return t('timeDifference.days', { count: days })
    } else {
      return t('timeDifference.sameDay')
    }
  }

  if (records?.length === 0) return <TimeLineEmptyState />

  return (
    <div className='relative space-y-8'>
            <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-border'></div>
            {Object.entries(groupedRecords)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayRecords], groupIndex, allGroups) => {
                const nextGroup = allGroups[groupIndex + 1]
                const currentGroupDate = new Date(date)
                const nextGroupDate = nextGroup ? new Date(nextGroup[0]) : null

                return (
                  <div key={date}>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-4'>
                        <div className='relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary'>
                          <div className='h-2 w-2 rounded-full bg-primary-foreground'></div>
                        </div>
                        <h3 className='text-lg font-medium text-foreground capitalize'>
                          {format(parseISO(date), 'MMMM dd, yyyy', { locale: dateLocale })}
                        </h3>
                      </div>

                      <div className='ml-16 space-y-4'>
                        {dayRecords
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((record) => (
                            <TimelineItem key={record.id} record={record} />
                          ))}
                      </div>
                    </div>

                    {nextGroupDate && (
                      <div className='flex items-center gap-4 my-6'>
                        <div className='relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted border-2 border-background'>
                          <Calendar className='h-4 w-4 text-muted-foreground' />
                        </div>
                        <div className='bg-muted/50 rounded-lg px-4 py-2 border border-border/50'>
                          <p className='text-sm text-muted-foreground font-medium'>
                            {formatTimeDifference(nextGroupDate, currentGroupDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
  )
}
