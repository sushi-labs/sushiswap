import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  formatCowDate,
  formatCowRelativeTime,
  formatCowTimestamp,
} from './cow-format'

const now = 1_800_000_000

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(now * 1000)
})
afterEach(() => {
  vi.useRealTimers()
})

it.each([
  [604_800 - 5, 'in 7d'],
  [2_592_000 - 5, 'in 30d'],
  [31_536_000 - 5, 'in 1y'],
  [20 * 86_400, 'in 20d'],
  [2 * 3_600 + 10, 'in 2h'],
  [5 * 60, 'in 5m'],
  [-3 * 86_400, '3d ago'],
])('formats %is from now as %s', (offset, expected) => {
  expect(formatCowRelativeTime(now + offset)).toBe(expected)
})

it('shows a placeholder instead of throwing on an unparseable date', () => {
  expect(formatCowDate('not a date')).toBe('—')
  expect(formatCowTimestamp('')).toBe('—')
  expect(formatCowDate('2027-01-05T12:00:00Z')).toBe('Jan 5')
})
