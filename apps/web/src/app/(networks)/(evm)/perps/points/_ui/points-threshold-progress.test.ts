import { describe, expect, it } from 'vitest'
import { getProgressPercent } from './points-threshold-progress'

describe('getProgressPercent', () => {
  it('treats a zero-dollar threshold as the start marker', () => {
    expect(
      getProgressPercent({
        totalFeesUsd: 379,
        thresholds: [
          { thresholdUsd: 0, multiplier: 1 },
          { thresholdUsd: 10_000, multiplier: 1.25 },
          { thresholdUsd: 50_000, multiplier: 1.5 },
          { thresholdUsd: 250_000, multiplier: 1.75 },
          { thresholdUsd: 1_000_000, multiplier: 2 },
        ],
      }),
    ).toBeCloseTo(0.9475)
  })

  it('supports threshold lists without a zero-dollar tier', () => {
    expect(
      getProgressPercent({
        totalFeesUsd: 379,
        thresholds: [
          { thresholdUsd: 10_000, multiplier: 1.25 },
          { thresholdUsd: 50_000, multiplier: 1.5 },
          { thresholdUsd: 250_000, multiplier: 1.75 },
          { thresholdUsd: 1_000_000, multiplier: 2 },
        ],
      }),
    ).toBeCloseTo(0.9475)
  })
})
