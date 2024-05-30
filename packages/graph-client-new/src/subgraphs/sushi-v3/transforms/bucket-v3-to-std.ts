import type { ResultOf } from 'gql.tada'
import type { SushiV3PoolBucketsQuery } from 'src/subgraphs/sushi-v3/queries/pool-with-buckets'
import type { SushiPoolBucket } from 'sushi/types'

type FetchedBucket = NonNullable<
  ResultOf<typeof SushiV3PoolBucketsQuery>['pool']
>['poolHourData'][number]

export function transformBucketsV3ToStd(
  buckets: FetchedBucket[],
): SushiPoolBucket[] {
  return buckets.map(transformBucketV3ToStd)
}

export function transformBucketV3ToStd(bucket: FetchedBucket): SushiPoolBucket {
  return {
    id: bucket.id,
    date: Number(bucket.date),
    liquidityUSD: Number(bucket.liquidityUSD),
    volumeUSD: Number(bucket.volumeUSD),
    feesUSD: Number(bucket.feesUSD),
    txCount: Number(bucket.txCount),
  }
}
