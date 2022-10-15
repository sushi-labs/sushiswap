import { Token } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Chef, Incentive } from '@sushiswap/wagmi'

export interface PairWithFarmRewards extends Pair {
  incentives: Incentive<Token>[]
  farmId: number | undefined
  chefType: Chef | undefined
}

export interface PairWithAlias extends Pair {
  dayChangeData: {
    id: string
    date: number
    volumeUSD: number
    liquidityUSD: number
    transactionCount: number
  }[]
}
