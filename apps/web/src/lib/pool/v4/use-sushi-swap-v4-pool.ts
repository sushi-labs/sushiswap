'use client'

import { useMemo } from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { type EvmAddress, EvmNative, SushiSwapV3Pool } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useReadContracts } from 'wagmi'
import type { SushiSwapV4ChainId } from './config'
import { INFINITY_CL_POOL_MANAGER_ABI } from './contract-abi'
import {
  decodeSushiSwapV4PoolKey,
  getSushiSwapV4PoolId,
  isSushiSwapV4FeeAmount,
} from './pool-key'
import type {
  SushiSwapV4Deployment,
  SushiSwapV4PoolId,
  SushiSwapV4PoolKey,
  SushiSwapV4PoolState,
} from './types'

export function useSushiSwapV4Pool({
  chainId,
  deployment,
  poolId: poolIdInput,
  poolKey: poolKeyInput,
}: {
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment | undefined
  poolId?: SushiSwapV4PoolId
  poolKey?: SushiSwapV4PoolKey
}): SushiSwapV4PoolState | undefined {
  const poolId = useMemo(
    () => poolIdInput ?? (poolKeyInput && getSushiSwapV4PoolId(poolKeyInput)),
    [poolIdInput, poolKeyInput],
  )

  const reads = useReadContracts({
    contracts:
      deployment && poolId
        ? [
            {
              address: deployment.clPoolManager,
              abi: INFINITY_CL_POOL_MANAGER_ABI,
              functionName: 'poolIdToPoolKey',
              args: [poolId],
              chainId,
            },
            {
              address: deployment.clPoolManager,
              abi: INFINITY_CL_POOL_MANAGER_ABI,
              functionName: 'getSlot0',
              args: [poolId],
              chainId,
            },
            {
              address: deployment.clPoolManager,
              abi: INFINITY_CL_POOL_MANAGER_ABI,
              functionName: 'getLiquidity',
              args: [poolId],
              chainId,
            },
          ]
        : [],
    allowFailure: true,
    query: {
      enabled: Boolean(deployment && poolId),
      refetchInterval: 10_000,
    },
  })

  const poolKey = useMemo(() => {
    if (poolKeyInput) return poolKeyInput
    const encoded = reads.data?.[0]?.result
    if (!encoded) return undefined

    return decodeSushiSwapV4PoolKey({
      currency0: encoded[0],
      currency1: encoded[1],
      hooks: encoded[2],
      poolManager: encoded[3],
      fee: encoded[4],
      parameters: encoded[5],
    })
  }, [poolKeyInput, reads.data])

  const currency0Address =
    poolKey?.currency0 === zeroAddress
      ? undefined
      : (poolKey?.currency0 as EvmAddress | undefined)
  const currency1Address =
    poolKey?.currency1 === zeroAddress
      ? undefined
      : (poolKey?.currency1 as EvmAddress | undefined)

  const token0 = useTokenWithCache({
    chainId,
    address: currency0Address,
    enabled: Boolean(currency0Address),
  })
  const token1 = useTokenWithCache({
    chainId,
    address: currency1Address,
    enabled: Boolean(currency1Address),
  })

  if (!poolId || !poolKey) return undefined

  const currency0 =
    poolKey.currency0 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : token0.data
  const currency1 =
    poolKey.currency1 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : token1.data
  const slot0 = reads.data?.[1]?.result
  const liquidity = reads.data?.[2]?.result
  const isInitialized = Boolean(slot0 && slot0[0] > 0n)
  const tokensLoading =
    (Boolean(currency0Address) && token0.isPending) ||
    (Boolean(currency1Address) && token1.isPending)

  const pool =
    isInitialized &&
    slot0 &&
    liquidity !== undefined &&
    currency0 &&
    currency1 &&
    isSushiSwapV4FeeAmount(poolKey.fee)
      ? new SushiSwapV3Pool(
          currency0.wrap(),
          currency1.wrap(),
          poolKey.fee,
          slot0[0],
          liquidity,
          slot0[1],
        )
      : null

  return {
    poolKey,
    poolId,
    pool,
    isInitialized,
    isInitialLoading: reads.isPending || tokensLoading,
    isError: reads.isError || token0.isError || token1.isError,
  }
}
