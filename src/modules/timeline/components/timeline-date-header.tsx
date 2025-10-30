import { getDateFnsLocale } from '@/lib/dateFnsLocales'
import { format, parseISO } from 'date-fns'
import { TimelineTodayMarker } from './timeline-today-marker'

interface TimelineDateHeaderProps {
  date: string
  timeFromToday: string
  isToday: boolean
}

export async function TimelineDateHeader({
  date,
  timeFromToday,
  isToday
}: TimelineDateHeaderProps) {
  const dateLocale = await getDateFnsLocale()

  if (isToday) {
    return <TimelineTodayMarker />
  }

  return (
    <div className='flex items-center gap-4'>
      <div
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${
          isToday
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg'
            : 'bg-primary'
        }`}
      >
        <div className='h-2 w-2 rounded-full bg-primary-foreground'></div>
      </div>
      <div className='flex items-center gap-3'>
        <h3 className='text-lg font-medium text-foreground capitalize'>
          {format(parseISO(date), 'MMMM dd, yyyy', { locale: dateLocale })}
        </h3>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            isToday
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {timeFromToday}
        </span>
      </div>
    </div>
  )
}
