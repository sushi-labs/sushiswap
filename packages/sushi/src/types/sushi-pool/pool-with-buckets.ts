import type { PoolId } from 'sushi/types'

export type PoolBucket = {
  id: string
  date: number
  liquidityUSD: number
  volumeUSD: number
  feesUSD: number
  txCount: number
}

export type PoolWithBuckets<T extends PoolId> = T & {
  poolHourData: PoolBucket[]
  poolDayData: PoolBucket[]
}
