import { createServerClient } from '@/lib/supabase/server'
import { TimelineItem } from './timeline-item'
import { Tables } from '@/lib/supabase/database.types'

export async function TimelineView() {
  const supabase = await createServerClient()
  const { data: records } = await supabase.from('records').select('*') as { data: Tables<'records'>[] }

  const groupedRecords: Record<string, Tables<'records'>[]> = (records ?? []).reduce((groups, record) => {
    const date = new Date(record.date)
    const dateKey = date.toISOString().split('T')[0]

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(record)
    return groups
  }, {} as Record<string, Tables<'records'>[]>)

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
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
