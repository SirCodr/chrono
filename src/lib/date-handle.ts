import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format
} from 'date-fns'

export function dateToTimestamptz(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX")
}

export const getTimeDifference = (olderDate: Date, newerDate: Date) => {
  const normalizedOlderDate = new Date(
    olderDate.getFullYear(),
    olderDate.getMonth(),
    olderDate.getDate()
  )
  const normalizedNewerDate = new Date(
    newerDate.getFullYear(),
    newerDate.getMonth(),
    newerDate.getDate()
  )

  const days = differenceInDays(normalizedNewerDate, normalizedOlderDate)
  const weeks = differenceInWeeks(normalizedNewerDate, normalizedOlderDate)
  const months = differenceInMonths(normalizedNewerDate, normalizedOlderDate)
  const years = differenceInYears(normalizedNewerDate, normalizedOlderDate)

  return {
    days,
    weeks,
    months,
    years
  }
}
