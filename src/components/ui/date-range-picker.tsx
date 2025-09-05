"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

type DatePickerProps = {
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (dateRange: DateRange) => void
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
}: DatePickerProps) {
  const dateRange = value ?? defaultValue

  const handleSelect = (newDate: DateRange | undefined) => {
    if (newDate) {
      onChange?.(newDate)
    }
  }

  const label = dateRange?.from
    ? `${format(dateRange.from, "MMM dd")} - ${
        dateRange.to ? format(dateRange.to, "MMM dd") : "..."
      }`
    : "Pick a date"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateRange}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          required
        />
      </PopoverContent>
    </Popover>
  )
}
