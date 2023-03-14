import { UsePoolsParams } from '../types'
import { getAllPools } from './getAllPools'
import { convertPoolOrPairtoRPool } from '@sushiswap/amm/dist/Trade/convertPoolOrPairtoRPool'
import { ConstantProductPoolCode } from '@sushiswap/router/dist/pools/ConstantProductPool'
import { BridgeBento, ConstantProductRPool, StableSwapRPool } from '@sushiswap/tines'
import { BentoPoolCode } from '@sushiswap/router/dist/pools/BentoPool'
import { LiquidityProviders } from '@sushiswap/router'
import { BentoBridgePoolCode } from '@sushiswap/router/dist/pools/BentoBridge'
import { getBentoBoxContractConfig } from '../../../../hooks'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'

export const getAllPoolsCodeMap = async (variables: Omit<UsePoolsParams, 'enabled'>) => {
  const { pairs, stablePools, constantProductPools, bridgeBentoPools } = await getAllPools(variables)

  const rPools = [
    ...[...(pairs || []), ...(stablePools || []), ...(constantProductPools || [])].map(convertPoolOrPairtoRPool),
    ...(bridgeBentoPools || []),
  ]

  const bentoAddress = isBentoBoxV1ChainId(variables.chainId)
    ? getBentoBoxContractConfig(variables.chainId).address
    : undefined

  return rPools.reduce<Map<string, PoolCode>>((acc, cur) => {
    if (cur instanceof ConstantProductRPool) {
      acc.set(cur.address, new ConstantProductPoolCode(cur, LiquidityProviders.SushiSwap, 'SushiSwap'))
    }

    if (cur instanceof StableSwapRPool) {
      acc.set(cur.address, new BentoPoolCode(cur, LiquidityProviders.Trident, 'Trident'))
    }

    if (cur instanceof BridgeBento && bentoAddress) {
      acc.set(cur.address, new BentoBridgePoolCode(cur, LiquidityProviders.Trident, 'Trident', bentoAddress))
    }

    return acc
  }, new Map<string, PoolCode>())
}
