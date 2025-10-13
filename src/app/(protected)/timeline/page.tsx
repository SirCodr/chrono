import { Header } from '@/components/header'
import { FiltersBar } from '@/modules/timeline/components/filters-bar'
import { TimelineView } from '@/modules/timeline/components/timeline-view'
import TimelineViewHeader from '@/modules/timeline/components/timeline-view-header'
import { getTranslations } from 'next-intl/server'

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; search?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const filterParams = await searchParams
  const t = await getTranslations('timeline')

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
              <p className='text-muted-foreground'>
                {t('subtitle')}
              </p>
            </div>
          </div>
          <div className='space-y-6'>
            <FiltersBar />
            <TimelineViewHeader />
            <TimelineView filterParams={filterParams} />
          </div>
        </div>
      </main>
    </div>
  )
}
