import { UsePoolsParams } from '../types'
import { getAllPools } from './getAllPools'
import { ConstantProductPoolCode } from '@sushiswap/router/dist/pools/ConstantProductPool'
import { BridgeBento, BridgeUnlimited, ConstantProductRPool, RToken, StableSwapRPool } from '@sushiswap/tines'
import { BentoPoolCode } from '@sushiswap/router/dist/pools/BentoPool'
import { LiquidityProviders } from '@sushiswap/router'
import { BentoBridgePoolCode } from '@sushiswap/router/dist/pools/BentoBridge'
import { bentoBoxV1Address, isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import { convertPoolOrPairtoRPool } from '@sushiswap/amm/dist/Trade/convertPoolOrPairtoRPool'
import { Native } from '@sushiswap/currency'
import { NativeWrapBridgePoolCode } from '@sushiswap/router/dist/pools/NativeWrapBridge'

export const getAllPoolsCodeMap = async (variables: Omit<UsePoolsParams, 'enabled'>) => {
  const { pairs, stablePools, constantProductPools, bridgeBentoPools } = await getAllPools(variables)

  console.log({ bridgeBentoPools })

  const rPools = [
    ...(pairs || []),
    ...(stablePools || []),
    ...(constantProductPools || []),
    ...(bridgeBentoPools || []),
  ]

  const poolCodeMap = new Map<string, PoolCode>()

  for (const pool of rPools) {
    if (isBentoBoxV1ChainId(variables.chainId) && pool instanceof BridgeBento) {
      poolCodeMap.set(
        pool.address,
        new BentoBridgePoolCode(pool, LiquidityProviders.Trident, 'Trident', bentoBoxV1Address[variables.chainId])
      )
    } else if (pool instanceof Pair) {
      poolCodeMap.set(
        pool.liquidityToken.address,
        new ConstantProductPoolCode(
          convertPoolOrPairtoRPool(pool, true) as ConstantProductRPool,
          LiquidityProviders.SushiSwap,
          'SushiSwap'
        )
      )
    } else if (pool instanceof ConstantProductPool) {
      poolCodeMap.set(
        pool.liquidityToken.address,
        new BentoPoolCode(
          convertPoolOrPairtoRPool(pool, true) as ConstantProductRPool,
          LiquidityProviders.Trident,
          'Trident'
        )
      )
    } else if (pool instanceof StablePool) {
      poolCodeMap.set(
        pool.liquidityToken.address,
        new BentoPoolCode(
          convertPoolOrPairtoRPool(pool, true) as StableSwapRPool,
          LiquidityProviders.Trident,
          'Trident'
        )
      )
    }
  }

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

  poolCodeMap.set(bridge.address, new NativeWrapBridgePoolCode(bridge, LiquidityProviders.NativeWrap))

  return poolCodeMap
}
