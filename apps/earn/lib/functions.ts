import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Pool } from '@sushiswap/client'

export const idToObject = (id: string) => {
  const [chainId, address] = id.split(':') as [ChainId, string]
  if (!chainId || !address) throw new Error('Invalid id.')

  return { chainId, address }
}

export const objectToId = ({ chainId, address }: { chainId: ChainId; address: string }) => `${chainId}:${address}`

export const isConstantProductPool = (
  pool: Pair | ConstantProductPool | StablePool | null
): pool is ConstantProductPool => {
  return pool instanceof ConstantProductPool
}

export const isStablePool = (pool: Pair | StablePool | null): pool is StablePool => {
  return pool instanceof StablePool
}

export const isLegacyPool = (pool: Pair | ConstantProductPool | StablePool | null): pool is Pair => {
  return pool instanceof Pair
}

export const incentiveRewardToToken = (chainId: ChainId, incentive: Pool['incentives'][0]): Token => {
  return new Token({
    chainId,
    address: incentive.rewardToken.address,
    symbol: incentive.rewardToken.symbol,
    decimals: incentive.rewardToken.decimals,
  })
}
