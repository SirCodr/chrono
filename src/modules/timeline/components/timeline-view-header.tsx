'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { RecordForm } from './record-form'
import { useTranslations } from 'next-intl'
import useBreakpoint from '@/hooks/useBreakpoint'
import type { RecordInsert } from '@/types/record'

interface TimelineViewHeaderProps {
  onCreate: (data: RecordInsert) => Promise<import('@/types/record').Record>
}

export default function TimelineViewHeader({ onCreate }: TimelineViewHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { xs } = useBreakpoint()
  const t = useTranslations('timeline.activity')

  return (
    <>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>{t('title')}</h2>
        <Button onClick={() => setIsModalOpen(true)} className='capitalize flex items-center'>
          <Plus className='h-4 w-4' />
          {!xs && t('addRecord')}
        </Button>
      </div>

      {isModalOpen && (
        <RecordForm
          open={true}
          onOpenChange={setIsModalOpen}
          onSuccess={() => setIsModalOpen(false)}
          onCreate={onCreate}
        />
      )}
    </>
  )
}