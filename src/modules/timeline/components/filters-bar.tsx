"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Filter, Search, SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn, dateToTimestamptz } from "@/lib/utils"
import { useEffect, useState, useTransition } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { useTranslations } from "next-intl"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function FiltersBar() {
  const [isContentCollapsed, setContentCollapsed] = useState<boolean>(true)
  const [ isPending, startTransition ] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const t = useTranslations('timeline.filters')
  const tSearch = useTranslations('forms.search')

  const [fromDate, setFromDate] = useState<Date | undefined>(searchParams.has("from") ? new Date(searchParams.get("from")!) : undefined)
  const [toDate, setToDate] = useState<Date | undefined>(searchParams.has("to") ? new Date(searchParams.get("to")!) : undefined)
  const [ search, setSearch ] = useState(searchParams.get("search") || "")


  const clearFilters = () => {
    startTransition(() => {
      replace(pathname)
    })
  }

  const hasActiveFilters = searchParams.has("search") || searchParams.has("from") || searchParams.has("to")

  function submitSearch() {
    startTransition(() => {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (fromDate) params.set("from", dateToTimestamptz(fromDate))
      if (toDate) params.set("to", dateToTimestamptz(toDate))

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      replace(url)
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitSearch()
  }

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setFromDate(searchParams.has("from") ? new Date(searchParams.get("from")!) : undefined)
    setToDate(searchParams.has("to") ? new Date(searchParams.get("to")!) : undefined)
  }, [searchParams])

  return (
    <Collapsible open={isContentCollapsed} onOpenChange={setContentCollapsed} className="flex flex-col gap-y-4">
      <div className='flex items-center justify-between'>
        <CollapsibleTrigger className='flex items-center gap-2 cursor-pointer group' >
          <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm'>
            <Filter className='h-4 w-4 text-white' />
          </div>
          <h3 className='font-semibold text-foreground'>{t('title')}</h3>
          {hasActiveFilters && (
            <div className='flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium'>
              {[search, fromDate, toDate].filter(Boolean).length}
            </div>
          )}
          <div className="ml-2 text-muted-foreground group-hover:text-orange-600 transition-colors">
            {isContentCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='text-muted-foreground hover:text-foreground'
          >
            {t('clearAll')}
          </Button>
        )}
      </div>

      <CollapsibleContent className='flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-background to-muted/20 rounded-xl border border-border/50 shadow-sm'>
        <form className='flex-1' onSubmit={handleSubmit} >
          <Label htmlFor='search' className='sr-only'>
            {tSearch('placeholder')}
          </Label>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              id='search'
              placeholder={t('searchPlaceholder')}
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-lg'
            />
          </div>
        </form>

        <div className='flex flex-col sm:flex-row gap-4 lg:w-auto'>
          <DatePicker
            value={fromDate}
            onChange={(date) => setFromDate(date)}
            placeholder={t('from')}
            className={cn(
              'h-12 w-auto px-4 justify-start text-left font-normal bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200 rounded-xl transition-all duration-200',
              fromDate && 'border-orange-300 bg-orange-50 text-orange-700',
              !fromDate && 'text-muted-foreground'
            )}
          />
          <DatePicker
            value={toDate}
            onChange={(date) => setToDate(date)}
            placeholder={t('to')}
            className={cn(
              'h-12 w-auto px-4 justify-start text-left font-normal bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200 rounded-xl transition-all duration-200',
              fromDate && 'border-orange-300 bg-orange-50 text-orange-700',
              !fromDate && 'text-muted-foreground'
            )}
          />

          <Button
            variant='outline'
            className='h-12 px-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-sm  hover:bg-gradient-to-br hover:from-orange-600/80 hover:to-orange-700/80 hover:shadow-md transition-all hover:text-white duration-200 border-0'
            onClick={submitSearch}
            disabled={isPending || (!search && !fromDate && !toDate)}
          >
            <SearchIcon className='h-4 w-4' />
            <span>{isPending ? t('searching') : t('search')}</span>
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
