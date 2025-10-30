import { createServerClient } from '@/lib/supabase/server'
import { TimelineItem } from './timeline-item'
import { Tables } from '@/lib/supabase/database.types'
import TimeLineEmptyState from './timeline-empty-state'
import { differenceInDays, format, isToday } from 'date-fns'
import { auth } from '@clerk/nextjs/server'
import { getTranslations } from 'next-intl/server'
import { TimelineDateHeader } from './timeline-date-header'
import { TimelineTimeDifference } from './timeline-time-difference'
import { dateToTimestamptz, getTimeDifference } from '@/lib/date-handle'
import { TimelineTodayMarker } from './timeline-today-marker'

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

  const today = new Date()

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
  const groupedRecords: Record<string, Tables<'records'>[]> = (
    records ?? []
  ).reduce((groups, record) => {
    const date = new Date(record.date)
    const dateKey = format(date, 'yyyy-MM-dd')

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(record)
    return groups
  }, {} as Record<string, Tables<'records'>[]>)
  const hasRecordsToday = groupedRecords[format(today, 'yyyy-MM-dd')]

  const formatTimeDifference = (olderDate: Date, newerDate: Date) => {
    const { days, weeks, months, years } = getTimeDifference(
      olderDate,
      newerDate
    )

    if (years > 0) {
      return t('timeDifference.years', { count: years })
    } else if (months > 0) {
      return t('timeDifference.months', { count: months })
    } else if (weeks > 0) {
      return t('timeDifference.weeks', { count: weeks })
    } else if (days > 0) {
      return t('timeDifference.days', { count: days })
    } else {
      return t('today')
    }
  }

  const getRecordOpacity = (date: Date) => {
    const days = differenceInDays(today, date)

    if (days <= 7) return 'opacity-100'
    if (days <= 30) return 'opacity-90'
    if (days <= 365) return 'opacity-75'
    return 'opacity-60'
  }

  if (records?.length === 0) return <TimeLineEmptyState />

  return (
    <div className='relative space-y-8'>
      <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-border'></div>

      {!hasRecordsToday && <TimelineTodayMarker />}

      {Object.entries(groupedRecords)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([groupDate, dayRecords], groupIndex, allGroups) => {
          const currentGroupDate = new Date(dayRecords[0].date)
          const nextGroup = allGroups[groupIndex + 1]
          const nextGroupDate = nextGroup
            ? new Date(nextGroup[1][0].date)
            : null
          const timeFromToday = t('timeAgo', {
            time: formatTimeDifference(currentGroupDate, today)
          })

          return (
            <div key={groupDate} className={getRecordOpacity(currentGroupDate)}>
              <div className='space-y-4'>
                <TimelineDateHeader
                  date={dateToTimestamptz(currentGroupDate)}
                  timeFromToday={timeFromToday}
                  isToday={isToday(currentGroupDate)}
                />

                <div className='ml-16 space-y-4'>
                  {dayRecords
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((record) => (
                      <TimelineItem key={record.id} record={record} />
                    ))}
                </div>
              </div>

              {nextGroupDate && (
                <TimelineTimeDifference
                  timeDifference={formatTimeDifference(
                    nextGroupDate,
                    currentGroupDate
                  )}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}
