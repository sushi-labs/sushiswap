'use client'

import { useMemo } from 'react'
import { useCurrencyWithCache } from 'src/lib/wagmi/hooks/tokens/use-currency-with-cache'
import {
  type EvmCurrency,
  type SushiSwapV4ChainId,
  SushiSwapV4Pool,
  type SushiSwapV4PoolKey,
  computeSushiSwapV4PoolId,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { type V4PoolSlot0, useV4PoolSlot0 } from './use-v4-pool-state'

function toV4Pool(slot0: V4PoolSlot0, currencies: [EvmCurrency, EvmCurrency]) {
  if (!slot0.isInitialized) return null

  return SushiSwapV4Pool.fromPoolKey({
    poolKey: slot0.poolKey,
    currencies,
    sqrtRatioX96: slot0.sqrtPriceX96,
    liquidity: slot0.liquidity,
    tickCurrent: slot0.tick,
  })
}

interface UseV4PoolResult {
  /** Null when the pool is not initialized; undefined while loading. */
  data: SushiSwapV4Pool | null | undefined
  isLoading: boolean
}

/**
 * The pool `poolKey` identifies; null when it is not initialized yet.
 * The key's currencies must be `currencyA` and `currencyB`.
 */
export function useV4PoolByKey({
  chainId,
  poolKey,
  currencyA,
  currencyB,
}: {
  chainId: SushiSwapV4ChainId
  poolKey: SushiSwapV4PoolKey | undefined
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
}): UseV4PoolResult & { poolId: Hex | undefined } {
  const poolId = useMemo(
    () => (poolKey ? computeSushiSwapV4PoolId(poolKey) : undefined),
    [poolKey],
  )
  const slot0 = useV4PoolSlot0({
    chainId,
    poolId: poolId ?? '0x',
    enabled: Boolean(poolId),
  })

  const pool = useMemo(() => {
    if (!slot0.data || !currencyA || !currencyB) return undefined
    return toV4Pool(slot0.data, [currencyA, currencyB])
  }, [slot0.data, currencyA, currencyB])

  return {
    data: pool,
    poolId,
    isLoading: slot0.isLoading,
  }
}

/** An initialized pool by ID, with its currencies hydrated from its key. */
export function useV4PoolById({
  chainId,
  poolId,
}: {
  chainId: SushiSwapV4ChainId
  poolId: Hex | undefined
}): UseV4PoolResult {
  const slot0 = useV4PoolSlot0({
    chainId,
    poolId: poolId ?? '0x',
    enabled: Boolean(poolId),
  })
  const currency0 = useCurrencyWithCache({
    chainId,
    address: slot0.data?.currencies[0],
  })
  const currency1 = useCurrencyWithCache({
    chainId,
    address: slot0.data?.currencies[1],
  })

  const pool = useMemo(() => {
    if (!slot0.data || !currency0.data || !currency1.data) return undefined
    return toV4Pool(slot0.data, [currency0.data, currency1.data])
  }, [slot0.data, currency0.data, currency1.data])

  return {
    data: pool,
    isLoading: slot0.isLoading || currency0.isLoading || currency1.isLoading,
  }
}
