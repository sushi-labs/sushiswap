'use client'

import { type RawV2Pool, hydrateV2Pool } from '@sushiswap/graph-client/data-api'
import { type ReactElement, useMemo } from 'react'
import { Amount } from 'sushi'
import { LiquidityAllocationCard } from '~evm/[chainId]/pool/_ui/liquidity-allocation-card'

interface PoolCompositionProps {
  pool: RawV2Pool
}

export function PoolComposition({
  pool: rawPool,
}: PoolCompositionProps): ReactElement {
  const [reserve0, reserve1] = useMemo(() => {
    const pool = hydrateV2Pool(rawPool)
    return [
      new Amount(pool.token0, pool.reserve0),
      new Amount(pool.token1, pool.reserve1),
    ]
  }, [rawPool])

  return (
    <LiquidityAllocationCard
      title="Pool Liquidity"
      amount0={reserve0}
      amount1={reserve1}
    />
  )
}
