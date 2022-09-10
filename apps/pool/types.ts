import { Token } from '@sushiswap/currency'
import { Chef, Incentive } from '@sushiswap/wagmi'

import { Pair } from '.graphclient'

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

export interface PairWithBalance extends PairWithFarmRewards {
  liquidityTokenBalance: string
}
