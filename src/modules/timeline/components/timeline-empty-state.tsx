'use client'

import { Button } from '@/components/ui/button'
import { Clock, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AddRecordForm } from './add-record-form'

export default function TimeLineEmptyState() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
        <div className='relative mb-6'>
          <div className='w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4'>
            <Clock className='w-12 h-12 text-orange-600' />
          </div>
          <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center'>
            <Sparkles className='w-4 h-4 text-white' />
          </div>
        </div>

        <h3 className='text-2xl font-bold text-foreground mb-2'>
          Your timeline awaits
        </h3>

        <p className='text-muted-foreground mb-6 max-w-md leading-relaxed'>
          Start documenting your journey! Create your first chronological record
          to begin building your personal timeline.
        </p>

        <Button
          onClick={() => setIsModalOpen(true)}
          size='lg'
          className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
        >
          <Plus className='w-5 h-5 mr-2' />
          Create First Record
        </Button>

        <div className='mt-8 text-xs text-muted-foreground/70'>
          💡 Tip: Records can include meetings, milestones, learnings, or any
          moment worth remembering
        </div>
      </div>
      {isModalOpen && (
        <AddRecordForm
          open={true}
          onOpenChange={setIsModalOpen}
          onSuccess={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
