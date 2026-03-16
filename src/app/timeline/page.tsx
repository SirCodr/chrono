'use client'

import { Header } from '@/components/header'
import { FiltersBar } from '@/modules/timeline/components/filters-bar'
import { TimelineView } from '@/modules/timeline/components/timeline-view'
import TimelineViewHeader from '@/modules/timeline/components/timeline-view-header'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRecords } from '@/hooks/use-records'
import { Suspense } from 'react'

function TimelinePage() {
  const searchParams = useSearchParams()
  const t = useTranslations('timeline')
  const { records, isLoading, createRecord, updateRecord, deleteRecord } =
    useRecords()

  const filterParams = {
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    search: searchParams.get('search') ?? undefined
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto p-6'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                {t('title')}
              </h1>
              <p className='text-muted-foreground'>{t('subtitle')}</p>
            </div>
          </div>
          <div className='space-y-6'>
            <FiltersBar />
            <TimelineViewHeader onCreate={createRecord} />
            <TimelineView
              filterParams={filterParams}
              records={records}
              isLoading={isLoading}
              onCreate={createRecord}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <TimelinePage />
    </Suspense>
  )
}
