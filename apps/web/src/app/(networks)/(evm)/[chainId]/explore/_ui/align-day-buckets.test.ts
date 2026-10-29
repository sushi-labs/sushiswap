import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { describe, expect, it } from 'vitest'
import { alignDayBuckets } from './align-day-buckets'

function bucket(
  date: number,
  value: number,
): AnalyticsDayBuckets['v2'][number] {
  return { id: String(date), date, liquidityUSD: value, volumeUSD: value * 10 }
}

describe('alignDayBuckets', () => {
  const data: AnalyticsDayBuckets = {
    v2: [bucket(4, 40), bucket(2, 20), bucket(1, 10)],
    v3: [bucket(3, 30), bucket(1, 15)],
    v4: [bucket(4, 4)],
    blade: [bucket(5, 50), bucket(2, 25)],
  }

  it('aligns by date, oldest first, carrying TVL over gaps, without mutating inputs', () => {
    const original = structuredClone(data)
    expect(alignDayBuckets(data, 'liquidityUSD')).toEqual({
      v2: [
        [1000, 10],
        [2000, 20],
        [3000, 20],
        [4000, 40],
        [5000, 40],
      ],
      v3: [
        [1000, 15],
        [2000, 15],
        [3000, 30],
        [4000, 30],
        [5000, 30],
      ],
      v4: [
        [1000, 0],
        [2000, 0],
        [3000, 0],
        [4000, 4],
        [5000, 4],
      ],
      blade: [
        [1000, 0],
        [2000, 25],
        [3000, 25],
        [4000, 25],
        [5000, 50],
      ],
    })
    expect(data).toEqual(original)
  })

  it('limits volume to the most recent union dates before sorting oldest first', () => {
    expect(alignDayBuckets(data, 'volumeUSD', 3)).toEqual({
      v2: [
        [3000, 0],
        [4000, 400],
        [5000, 0],
      ],
      v3: [
        [3000, 300],
        [4000, 0],
        [5000, 0],
      ],
      v4: [
        [3000, 0],
        [4000, 40],
        [5000, 0],
      ],
      blade: [
        [3000, 0],
        [4000, 0],
        [5000, 500],
      ],
    })
  })

  it('handles empty histories and a chain with only V4 history', () => {
    const empty: AnalyticsDayBuckets = { v2: [], v3: [], v4: [], blade: [] }
    expect(alignDayBuckets(empty, 'liquidityUSD')).toEqual(empty)
    expect(
      alignDayBuckets({ ...empty, v4: [bucket(4, 4)] }, 'liquidityUSD'),
    ).toEqual({
      v2: [[4000, 0]],
      v3: [[4000, 0]],
      v4: [[4000, 4]],
      blade: [[4000, 0]],
    })
  })
})
