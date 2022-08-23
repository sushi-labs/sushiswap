import { Token } from '@sushiswap/currency'
import { Incentive } from '@sushiswap/wagmi'

import { Pair } from '.graphclient'

export interface PairWithFarmRewards extends Pair {
  incentives: Incentive<Token>[]
}

export interface PairWithAlias extends PairWithFarmRewards {
  dayChangeData: {
    id: string
    date: number
    volumeUSD: number
    liquidityUSD: number
    txCount: number
  }[]
}

export interface PairWithBalance extends PairWithFarmRewards {
  liquidityTokenBalance: string
}
