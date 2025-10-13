"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLocale, useTranslations } from "next-intl"
import { useDateFnsLocale } from "@/hooks/useDateFnsLocale"

type DatePickerProps = {
  value: Date | undefined
  defaultValue?: Date | undefined
  placeholder?: string
  className?: string
  onChange?: (date: Date | undefined) => void
}

export function DatePicker({ value, defaultValue, placeholder, className, onChange }: DatePickerProps) {
  const t  = useTranslations('datepicker')
  const dateLocale = useDateFnsLocale()
  const date = value ?? defaultValue

  const handleSelect = (newDate: Date | undefined) => {
    onChange?.(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!date}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal capitalize',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'MMM dd', { locale: dateLocale })
          ) : (
            <span>{placeholder || t('pickDate')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          locale={dateLocale}
        />
      </PopoverContent>
    </Popover>
  )
}
