import { Calendar } from 'lucide-react'

interface TimelineTimeDifferenceProps {
  timeDifference: string
}

export function TimelineTimeDifference({
  timeDifference
}: TimelineTimeDifferenceProps) {
  return (
    <div className='flex items-center gap-4 my-6'>
      <div className='relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted border-2 border-background'>
        <Calendar className='h-4 w-4 text-muted-foreground' />
      </div>
      <div className='bg-muted/50 rounded-lg px-4 py-2 border border-border/50'>
        <p className='text-sm text-muted-foreground font-medium'>
          {timeDifference}
        </p>
      </div>
    </div>
  )
}
