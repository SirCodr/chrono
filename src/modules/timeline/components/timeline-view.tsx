import { createServerClient } from '@/lib/supabase/server'
import { TimelineItem } from './timeline-item'

// Mock data for timeline records
const mockRecords = [
  {
    id: '1',
    title: 'Project Kickoff Meeting',
    description:
      'Initial meeting with the development team to discuss project requirements and timeline.',
    category: 'Work',
    tags: ['meeting', 'project', 'planning'],
    date: new Date('2024-01-15T10:00:00'),
    createdAt: new Date('2024-01-15T10:30:00')
  }
]

export async function TimelineView() {
  const supabase = await createServerClient()
  const { data: posts } = await supabase.from('posts').select('*')

  const groupedRecords = posts!.reduce((groups, record) => {
    if (!groups[record.date]) {
      groups[record.date] = []
    }
    groups[record.date].push(record)
    return groups
  }, {} as Record<string, typeof mockRecords>)

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
                .sort((a, b) => b.recordDate.getTime() - a.recordDate.getTime())
                .map((record) => (
                  <TimelineItem key={record.id} record={record} />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
