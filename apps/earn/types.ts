import { Token } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client'
import { Chef, Incentive } from '@sushiswap/wagmi'

export interface PairWithFarmRewards extends Pair {
  incentives: Incentive<Token>[]
  farmId: number | undefined
  chefType: Chef | undefined
}
