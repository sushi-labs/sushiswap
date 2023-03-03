import { Amount } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client'
import { Pool } from '@sushiswap/client'
import { useMemo } from 'react'
import useSWR from 'swr'
import { useTokensFromPool } from '../useTokensFromPool'

export function getGraphPoolUrl(poolId: string) {
  return `/earn/api/graphPool/${poolId}`
}

export const useGraphPool = (pool: Pool) => {
  const { data: graphPool } = useSWR<Pair>(getGraphPoolUrl(pool.id), async (url) =>
    fetch(url).then((data) => data.json())
  )

  const { token0, token1, liquidityToken } = useTokensFromPool(pool)

  return useMemo(() => {
    return {
      token0,
      token1,
      liquidityToken,
      liquidityNative: graphPool ? Number(graphPool?.liquidityNative) : null,
      liquidity1dChange: graphPool ? Number(graphPool?.liquidity1dChange ?? 0) : null,
      fees1d: graphPool ? Number(graphPool?.fees1d ?? 0) : null,
      fees1dChange: graphPool ? Number(graphPool?.fees1dChange ?? 0) : null,
      volume1d: graphPool ? Number(graphPool?.volume1d ?? 0) : null,
      volume1dChange: graphPool ? Number(graphPool?.volume1dChange ?? 0) : null,
      txCount1d: graphPool ? Number(graphPool?.txCount1d ?? 0) : null,
      txCount1dChange: graphPool ? Number(graphPool?.txCount1dChange ?? 0) : null,
      hourSnapshots: graphPool?.hourSnapshots ?? null,
      daySnapshots: graphPool?.daySnapshots ?? null,
      reserve0: token0 && graphPool ? Amount.fromRawAmount(token0, graphPool.reserve0) : null,
      reserve1: token1 && graphPool ? Amount.fromRawAmount(token1, graphPool.reserve1) : null,
      totalSupply: liquidityToken && graphPool ? Amount.fromRawAmount(liquidityToken, graphPool.liquidity) : null,
    } as const
  }, [graphPool, liquidityToken, token0, token1])
}
