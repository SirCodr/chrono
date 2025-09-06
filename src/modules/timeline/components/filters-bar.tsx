"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { dateToTimestamptz } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useDebounce } from 'use-debounce'

export function FiltersBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.has("from") ? new Date(searchParams.get("from")!) : undefined,
    to: searchParams.has("to") ? new Date(searchParams.get("to")!) : undefined,
  })
  const [ search, setSearch ] = useState(searchParams.get("search") || "")
  const [debouncedDate] = useDebounce(date, 150)
  const [debouncedSearch] = useDebounce(search, 150)


  const clearFilters = () => {
    setDate(undefined)
    setSearch("")
  }

  function updateSearchParam(query: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim().length > 0) {
      params.set("search", query)
    } else {
      params.delete("search")
    }

    replace(`${pathname}?${params.toString()}`)
  }

  function updateDateParam(date: DateRange | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (date?.from) {
      const fromTimeStamp = dateToTimestamptz(date.from)
      params.set("from", fromTimeStamp)
    } else {
      params.delete("from")
    }

    if (date?.to) {
      const toTimeStamp = dateToTimestamptz(date.to)
      params.set("to", toTimeStamp)
    } else {
      params.delete("to")
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const hasActiveFilters = search || date?.from

  useEffect(() => {
    updateDateParam(debouncedDate)
  }, [debouncedDate])

  useEffect(() => {
    updateSearchParam(debouncedSearch)
  }, [debouncedSearch])

  return (
    <div className='flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-background to-muted/20 rounded-xl border border-border/50 shadow-sm'>
      <div className='flex-1'>
        <Label htmlFor='search' className='sr-only'>
          Search records
        </Label>
        <div className='relative'>
          <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
          <Input
            id='search'
            placeholder='Search your timeline records...'
            value={search || ''}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-lg'
          />
        </div>
      </div>

      <div className='flex gap-3'>
        <DateRangePicker
          value={date}
          onChange={(date) => setDate(date)}
        />

        {hasActiveFilters && (
          <Button
            variant='outline'
            size='icon'
            onClick={clearFilters}
            className='h-12 w-12 bg-background/50 border-border/50 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
