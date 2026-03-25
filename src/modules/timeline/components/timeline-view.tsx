'use client'

import { useState, useEffect, useRef } from 'react'

import { TimelineItem } from './timeline-item'
import type {
  Record as ChronoRecord,
  RecordInsert,
  RecordUpdate
} from '@/types/record'
import TimeLineEmptyState from './timeline-empty-state'
import { differenceInDays, format, isToday } from 'date-fns'
import { useTranslations } from 'next-intl'
import { TimelineDateHeader } from './timeline-date-header'
import { TimelineTimeDifference } from './timeline-time-difference'
import { dateToTimestamptz, getTimeDifference } from '@/lib/date-handle'
import { TimelineTodayMarker } from './timeline-today-marker'

type FilterParams = {
  from?: string
  to?: string
  search?: string
}

type GroupedRecords = { [dateKey: string]: ChronoRecord[] }

type Props = {
  filterParams: FilterParams
  records: ChronoRecord[]
  isLoading: boolean
  onCreate: (data: RecordInsert) => Promise<ChronoRecord>
  onUpdate: (data: RecordUpdate) => Promise<ChronoRecord>
  onDelete: (id: string) => Promise<void>
}

export function TimelineView({
  filterParams,
  records,
  isLoading,
  onCreate,
  onUpdate,
  onDelete
}: Props) {
  const t = useTranslations('timeline.activity')
  const today = new Date()

  const [visibleCount, setVisibleCount] = useState(10)
  const loaderRef = useRef<HTMLDivElement>(null)

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.date)

    if (filterParams.search) {
      const search = filterParams.search.toLowerCase()
      if (!record.title.toLowerCase().includes(search)) return false
    }
    if (filterParams.from) {
      const fromDate = new Date(filterParams.from)
      fromDate.setHours(0, 0, 0, 0)
      if (recordDate < fromDate) return false
    }
    if (filterParams.to) {
      const toDate = new Date(filterParams.to)
      toDate.setHours(23, 59, 59, 999)
      if (recordDate > toDate) return false
    }

    return true
  })

  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 10)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [isLoading, filteredRecords.length, visibleCount])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <span className='text-muted-foreground text-sm'>Cargando...</span>
      </div>
    )
  }

  if (filteredRecords.length === 0)
    return <TimeLineEmptyState onCreate={onCreate} />

  const visibleRecords = filteredRecords.slice(0, visibleCount)

  const groupedRecords = visibleRecords.reduce<GroupedRecords>(
    (groups, record) => {
      const dateKey = format(new Date(record.date), 'yyyy-MM-dd')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(record)
      return groups
    },
    {}
  )

  const hasRecordsToday = groupedRecords[format(today, 'yyyy-MM-dd')]

  const formatTimeDifference = (olderDate: Date, newerDate: Date) => {
    const { days, weeks, months, years } = getTimeDifference(
      olderDate,
      newerDate
    )
    if (years > 0) return t('timeDifference.years', { count: years })
    if (months > 0) return t('timeDifference.months', { count: months })
    if (weeks > 0) return t('timeDifference.weeks', { count: weeks })
    if (days > 0) return t('timeDifference.days', { count: days })
    return t('today')
  }

  const getRecordOpacity = (date: Date) => {
    const days = differenceInDays(today, date)
    if (days <= 7) return 'opacity-100'
    if (days <= 30) return 'opacity-90'
    if (days <= 365) return 'opacity-75'
    return 'opacity-60'
  }

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
                      <TimelineItem
                        key={record.id}
                        record={record}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                      />
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

      {filteredRecords.length > visibleCount && (
        <div ref={loaderRef} className='py-8 flex justify-center'>
          <span className='text-sm text-muted-foreground animate-pulse'>
            Cargando más registros...
          </span>
        </div>
      )}
    </div>
  )
}
