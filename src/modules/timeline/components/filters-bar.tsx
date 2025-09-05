"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { dateToTimestamptz } from "@/lib/utils"

export function FiltersBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const searchParam = searchParams.get("search")
  const dateFromParam = searchParams.get("from")
  const dateToParam = searchParams.get("to")

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    params.delete("from")
    params.delete("to")
    replace(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(query: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set("search", query)
    } else {
      params.delete("search")
    }

    replace(`${pathname}?${params.toString()}`)
  }

  function handleDateChange(date: DateRange | undefined) {
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

  const hasActiveFilters = searchParam || dateFromParam

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
            value={searchParam || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-lg'
          />
        </div>
      </div>

      <div className='flex gap-3'>
        <DateRangePicker
          value={{ 
            from: searchParams.has("from") ? new Date(dateFromParam!) : undefined,
            to: searchParams.has("to") ? new Date(dateToParam!) : undefined, 
          }}
          onChange={handleDateChange}
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
