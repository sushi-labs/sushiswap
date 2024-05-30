import type { ResultOf } from 'gql.tada'
import type { SushiV2PoolBucketsQuery } from 'src/subgraphs/sushi-v2/queries/pool-with-buckets'
import type { SushiPoolBucket } from 'sushi/types'

type FetchedBucket = NonNullable<
  ResultOf<typeof SushiV2PoolBucketsQuery>['pool']
>['poolHourData'][number]

export function transformBucketsV2ToStd(
  buckets: FetchedBucket[],
): SushiPoolBucket[] {
  return buckets.map(transformBucketV2ToStd)
}

export function transformBucketV2ToStd(bucket: FetchedBucket): SushiPoolBucket {
  return {
    id: bucket.id,
    date: Number(bucket.date),
    liquidityUSD: Number(bucket.liquidityUSD),
    volumeUSD: Number(bucket.volumeUSD),
    feesUSD: Number(bucket.volumeUSD) * 0.003,
    txCount: Number(bucket.txCount),
  }
}
