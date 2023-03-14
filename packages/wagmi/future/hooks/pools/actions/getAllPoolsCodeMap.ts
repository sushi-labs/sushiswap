import { UsePoolsParams } from '../types'
import { getAllPools } from './getAllPools'
import { ConstantProductPoolCode } from '@sushiswap/router/dist/pools/ConstantProductPool'
import { BridgeBento, BridgeUnlimited, ConstantProductRPool, RToken, StableSwapRPool } from '@sushiswap/tines'
import { BentoPoolCode } from '@sushiswap/router/dist/pools/BentoPool'
import { LiquidityProviders } from '@sushiswap/router'
import { BentoBridgePoolCode } from '@sushiswap/router/dist/pools/BentoBridge'
import { getBentoBoxContractConfig } from '../../../../hooks'
import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import { convertPoolOrPairtoRPool } from '@sushiswap/amm/dist/Trade/convertPoolOrPairtoRPool'
import { Native } from '@sushiswap/currency'
import { NativeWrapBridgePoolCode } from '@sushiswap/router/dist/pools/NativeWrapBridge'

export const getAllPoolsCodeMap = async (variables: Omit<UsePoolsParams, 'enabled'>) => {
  const { pairs, stablePools, constantProductPools, bridgeBentoPools } = await getAllPools(variables)

  const rPools = [
    ...(pairs || []),
    ...(stablePools || []),
    ...(constantProductPools || []),
    ...(bridgeBentoPools || []),
  ]

  const bentoAddress = isBentoBoxV1ChainId(variables.chainId)
    ? getBentoBoxContractConfig(variables.chainId).address
    : undefined

  const rp = rPools.reduce<Map<string, PoolCode>>((acc, cur) => {
    if (cur instanceof BridgeBento && bentoAddress) {
      acc.set(cur.address, new BentoBridgePoolCode(cur, LiquidityProviders.Trident, 'Trident', bentoAddress))
      return acc
    }

    if (!(cur instanceof BridgeBento)) {
      const rpool = convertPoolOrPairtoRPool(cur)
      if (cur instanceof Pair && rpool instanceof ConstantProductRPool) {
        acc.set(rpool.address, new ConstantProductPoolCode(rpool, LiquidityProviders.SushiSwap, 'SushiSwap'))
      }

      if (cur instanceof ConstantProductPool && rpool instanceof ConstantProductRPool) {
        acc.set(rpool.address, new ConstantProductPoolCode(rpool, LiquidityProviders.Trident, 'Trident'))
      }

      if (cur instanceof StablePool && rpool instanceof StableSwapRPool) {
        acc.set(rpool.address, new BentoPoolCode(rpool, LiquidityProviders.Trident, 'Trident'))
      }
    }

    return acc
  }, new Map<string, PoolCode>())

  const bridge = new BridgeUnlimited(
    Native.onChain(variables.chainId).wrapped.address,
    {
      address: '',
      name: Native.onChain(variables.chainId).name,
      symbol: Native.onChain(variables.chainId).symbol,
      chainId: variables.chainId,
    } as RToken,
    Native.onChain(variables.chainId).wrapped as RToken,
    0,
    50_000
  )

  rp.set(bridge.address, new NativeWrapBridgePoolCode(bridge, LiquidityProviders.NativeWrap))

  return rp
}
