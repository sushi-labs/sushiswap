import { Pair } from '.graphclient'

export interface PairWithAlias extends Pair {
  dayChangeData: {
    id: string
    date: number
    volumeUSD: number
    reserveUSD: number
    txCount: number
  }[]
}
