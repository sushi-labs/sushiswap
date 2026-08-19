import ms from 'ms'
import { describe, expect, it } from 'vitest'
import { formatLaunchpadAge, formatLaunchpadAgeLabel } from './format'

const NOW = new Date('2026-08-18T12:00:00.000Z').getTime()

function ago(offset: string) {
  return formatLaunchpadAge(new Date(NOW - ms(offset)), NOW)
}

describe('formatLaunchpadAge', () => {
  it('collapses the first minute to "now"', () => {
    expect(ago('0s')).toBe('now')
    expect(ago('59s')).toBe('now')
  })

  it('steps up through minutes, hours, days and years', () => {
    expect(ago('1m')).toBe('1m')
    expect(ago('59m')).toBe('59m')
    expect(ago('1h')).toBe('1h')
    expect(ago('23h')).toBe('23h')
    expect(ago('1d')).toBe('1d')
    expect(ago('364d')).toBe('364d')
    expect(ago('365d')).toBe('1y')
  })

  it('truncates rather than rounds, so nothing reads older than it is', () => {
    expect(ago('119m')).toBe('1h')
  })

  it('accepts the ISO strings the API returns', () => {
    expect(formatLaunchpadAge('2026-08-18T08:00:00.000Z', NOW)).toBe('4h')
  })

  it('clamps future timestamps instead of printing a negative age', () => {
    expect(formatLaunchpadAge(new Date(NOW + ms('5m')), NOW)).toBe('now')
  })

  it('falls back to a dash for unparseable input', () => {
    expect(formatLaunchpadAge('not a date', NOW)).toBe('—')
  })
})

describe('formatLaunchpadAgeLabel', () => {
  it('expands a compact age into something a screen reader can read', () => {
    expect(formatLaunchpadAgeLabel('11m')).toBe('Launched 11m ago')
    expect(formatLaunchpadAgeLabel('3d')).toBe('Launched 3d ago')
  })

  it('avoids "now ago"', () => {
    expect(formatLaunchpadAgeLabel('now')).toBe('Launched just now')
  })
})
