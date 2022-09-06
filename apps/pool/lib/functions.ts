import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ConstantProductPool, Pair } from '@sushiswap/exchange'

import { Incentive } from '../.graphclient'

export const isConstantProductPool = (pool: Pair | ConstantProductPool | null): pool is ConstantProductPool => {
  return pool instanceof ConstantProductPool
}

export const isLegacyPool = (pool: Pair | ConstantProductPool | null): pool is Pair => {
  return pool instanceof Pair
}

export const incentiveRewardToToken = (chainId: ChainId, incentive: Incentive): Token => {
  return new Token({
    chainId,
    address: incentive.rewardToken.address,
    symbol: incentive.rewardToken.symbol,
    decimals: incentive.rewardToken.decimals,
  })
}
