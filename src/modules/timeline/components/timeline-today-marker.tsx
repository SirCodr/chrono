import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { getDateFnsLocale } from '@/lib/dateFnsLocales'

export async function TimelineTodayMarker() {
  const dateLocale = await getDateFnsLocale()
  const today = new Date()

  return (
    <div className='flex items-center gap-4'>
      <div className='relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg'>
        <Clock className='h-4 w-4 text-white' />
      </div>
      <div className='flex items-center gap-3'>
        <h3 className='text-lg font-medium text-foreground capitalize'>
          {format(today, 'MMMM dd, yyyy', { locale: dateLocale })}
        </h3>
        <span className='text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'>
          Hoy
        </span>
      </div>
    </div>
  )
}
