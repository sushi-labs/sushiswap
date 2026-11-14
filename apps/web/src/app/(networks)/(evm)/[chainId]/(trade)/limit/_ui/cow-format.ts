import {
  format,
  formatDistanceToNowStrict,
  isThisYear,
  isValid,
} from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

export function formatCowTokenAmount(
  currency: EvmCurrency,
  amount: bigint | string,
): string {
  return `${new Amount(currency, amount).toSignificant(6)} ${currency.symbol}`
}

// Shown for a date the API returned in an unexpected format.
const INVALID_DATE = '—'

// CoW timestamps (`validTo`) are in seconds; `creationDate` is an ISO string.
function toDate(value: number | string): Date {
  return typeof value === 'number' ? new Date(value * 1000) : new Date(value)
}

// e.g. "Nov 18, 2026, 5:39 PM"
export function formatCowTimestamp(value: number | string): string {
  const date = toDate(value)
  return isValid(date) ? format(date, 'PPp') : INVALID_DATE
}

// e.g. "Nov 18", with the year when it is not this year.
export function formatCowDate(value: number | string): string {
  const date = toDate(value)
  if (!isValid(date)) return INVALID_DATE
  return format(date, isThisYear(date) ? 'MMM d' : 'MMM d, yyyy')
}

const COMPACT_UNITS: Record<string, string> = {
  xSeconds: 's',
  xMinutes: 'm',
  xHours: 'h',
  xDays: 'd',
  xMonths: 'mo',
  xYears: 'y',
}

// date-fns picks and rounds the unit; this only shortens its wording.
const compactLocale: Locale = {
  ...enUS,
  formatDistance: (token: string, count: number, options) => {
    const value = `${count}${COMPACT_UNITS[token] ?? ''}`
    if (!options?.addSuffix) return value
    return (options.comparison ?? 0) > 0 ? `in ${value}` : `${value} ago`
  },
}

// e.g. "in 7d" or "5m ago"
export function formatCowRelativeTime(seconds: number): string {
  const date = toDate(seconds)
  if (!isValid(date)) return INVALID_DATE
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: compactLocale,
  })
}
