import { describe, expect, it } from 'vitest'
import { formatPercent, volumeChangePercent } from './format'

describe('volumeChangePercent', () => {
  it('compares adjacent equal windows using the combined total', () => {
    expect(volumeChangePercent(150, 250)).toBe(50)
    expect(volumeChangePercent(50, 150)).toBe(-50)
    expect(volumeChangePercent(100, 200)).toBe(0)
    expect(volumeChangePercent(0, 100)).toBe(-100)
  })

  it.each([
    [null, 100],
    [100, null],
    [undefined, 100],
    [100, undefined],
    [0, 0],
    [100, 100],
    [200, 100],
    [-1, 100],
    [Number.NaN, 100],
    [100, Number.POSITIVE_INFINITY],
  ])(
    'does not invent a change for invalid or missing windows (%s, %s)',
    (current, combined) => {
      const change = volumeChangePercent(current, combined)
      expect(change).toBeNull()
      expect(formatPercent(change)).toBe('—')
    },
  )
})
