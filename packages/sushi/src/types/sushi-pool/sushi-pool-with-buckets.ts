import type { SushiPoolBase } from 'sushi/types'

export type SushiPoolBucket = {
  id: string
  date: number
  liquidityUSD: number
  volumeUSD: number
  feesUSD: number
  txCount: number
}

export type SushiPoolWithBuckets<T extends SushiPoolBase> = T & {
  poolHourData: SushiPoolBucket[]
  poolDayData: SushiPoolBucket[]
}
