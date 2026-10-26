import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'

/**
 * Each version's values on the union of all versions' days, oldest first.
 * The subgraphs skip quiet days, so a missing day has no volume but keeps the
 * previous TVL; before a version's first bucket it has none.
 */
export function alignDayBuckets(
  data: AnalyticsDayBuckets,
  metric: 'liquidityUSD' | 'volumeUSD',
  limit?: number,
): Record<keyof AnalyticsDayBuckets, [number, number][]> {
  const dates = [
    ...new Set(
      Object.values(data).flatMap((buckets) =>
        buckets.map((bucket) => bucket.date),
      ),
    ),
  ]
    .sort((a, b) => b - a)
    .slice(0, limit)
    .reverse()

  function align(buckets: AnalyticsDayBuckets['v2']): [number, number][] {
    const values = new Map(
      buckets.map((bucket) => [bucket.date, bucket[metric]]),
    )
    let previous = 0
    return dates.map((date) => {
      const value =
        values.get(date) ?? (metric === 'liquidityUSD' ? previous : 0)
      previous = value
      return [date * 1000, value]
    })
  }

  return {
    v2: align(data.v2),
    v3: align(data.v3),
    v4: align(data.v4),
    blade: align(data.blade),
  }
}
