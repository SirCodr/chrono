import { createServerClient } from '@/lib/supabase/server'
import { TimelineItem } from './timeline-item'
import { Tables } from '@/lib/supabase/database.types'
import TimeLineEmptyState from './timeline-empty-state'
import { format, parseISO } from 'date-fns'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export async function TimelineView({ searchParams }: Props) {
  const supabase = await createServerClient()

  let query = supabase.from('records').select('*')

  if (searchParams?.from) {
    query = query.gte('date', searchParams.from as string)
  }
  if (searchParams?.to) {
    query = query.lte('date', searchParams.to as string)
  }
  if (searchParams?.search) {
    query = query.ilike('title', `%${searchParams.search}%`)
  }

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

  if (records?.length === 0) return <TimeLineEmptyState />

  return (
    <div className='relative space-y-8'>
      <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-border'></div>
      {Object.entries(groupedRecords)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, dayRecords]) => (
          <div key={date} className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary'>
                <div className='h-2 w-2 rounded-full bg-primary-foreground'></div>
              </div>
              <h3 className='text-lg font-medium text-foreground'>
                {format(parseISO(date), 'MMMM dd, yyyy')}
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
        ))}
    </div>
  )
}
