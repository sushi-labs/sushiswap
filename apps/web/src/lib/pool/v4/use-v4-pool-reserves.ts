'use client'

import type { V4Pool } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useV4PoolSlot0, useV4PoolTicks } from './use-v4-pool-state'
import { getV4PoolReserves } from './v4-pool-math'

/** The pool's reserves, summed live from its on-chain ticks. */
export function useV4PoolReserves({
  pool,
  enabled = true,
}: {
  pool: V4Pool
  enabled?: boolean
}) {
  const { chainId, address: poolId, token0, token1 } = pool

  const slot0 = useV4PoolSlot0({ chainId, poolId, enabled })
  const ticks = useV4PoolTicks({
    chainId,
    poolId,
    tickSpacing: slot0.data?.tickSpacing,
    enabled,
  })

  const data = useMemo(():
    | [Amount<EvmCurrency>, Amount<EvmCurrency>]
    | undefined => {
    if (!slot0.data || !ticks.data) return undefined

    const [reserve0, reserve1] = getV4PoolReserves({
      sqrtPriceX96: slot0.data.sqrtPriceX96,
      ticks: ticks.data,
    })

    return [new Amount(token0, reserve0), new Amount(token1, reserve1)]
  }, [slot0.data, ticks.data, token0, token1])

  return {
    data,
    isLoading: slot0.isLoading || ticks.isLoading,
    isError: slot0.isError || ticks.isError,
  }
}
