import { Pair } from '.graphclient'

export interface PairWithAlias extends Pair {
  dayChangeData: {
    id: string
    date: number
    volumeUSD: number
    liquidityUSD: number
    txCount: number
  }[]
}

export interface PairWithBalance extends Pair {
  liquidityTokenBalance: string
}
