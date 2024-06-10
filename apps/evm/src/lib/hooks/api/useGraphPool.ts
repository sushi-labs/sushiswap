'use client'

import 'sushi/bigint-serializer'

import { SushiV2Pool } from '@sushiswap/graph-client-new/sushi-v2'
import { useMemo } from 'react'
import { Amount } from 'sushi/currency'

import { useQuery } from '@tanstack/react-query'
import type { PoolId } from 'sushi'
import { getTokensFromPool } from '../useTokensFromPool'

export function getGraphPoolUrl(poolId: string) {
  return `/pools/api/graphPool/${poolId}`
}

export const useGraphPool = (pool: PoolId) => {
  const {
    data: graphPool,
    isLoading,
    error,
  } = useQuery<SushiV2Pool>({
    queryKey: [getGraphPoolUrl(pool.id)],
    queryFn: async () => {
      const res = await fetch(getGraphPoolUrl(pool.id))

      return JSON.parse(await res.text())
    },
  })

  const { token0, token1, liquidityToken } = useMemo(() => {
    if (!graphPool)
      return {
        token0: undefined,
        token1: undefined,
        liquidityToken: undefined,
      }

    return getTokensFromPool(graphPool)
  }, [graphPool])

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: {
        token0,
        token1,
        liquidityToken,
        // liquidityNative: graphPool ? Number(graphPool?.reserveETH) : null,
        liquidityUSD: graphPool ? Number(graphPool?.liquidityUSD) : null,
        // liquidity1dChange: graphPool
        //   ? Number(graphPool?.liquidity1dChange ?? 0)
        //   : null,
        // fees1d: graphPool ? Number(graphPool?.fees1d ?? 0) : null,
        // fees1dChange: graphPool ? Number(graphPool?.fees1dChange ?? 0) : null,
        // volume1d: graphPool ? Number(graphPool?.volume1d ?? 0) : null,
        // volume1dChange: graphPool
        //   ? Number(graphPool?.volume1dChange ?? 0)
        //   : null,
        // txCount1d: graphPool ? Number(graphPool?.txCount1d ?? 0) : null,
        // txCount1dChange: graphPool
        //   ? Number(graphPool?.txCount1dChange ?? 0)
        //   : null,
        // hourSnapshots: graphPool?.hourSnapshots ?? null,
        // daySnapshots: graphPool?.daySnapshots ?? null,
        reserve0:
          token0 && graphPool
            ? Amount.fromRawAmount(token0, graphPool.reserve0)
            : null,
        reserve1:
          token1 && graphPool
            ? Amount.fromRawAmount(token1, graphPool.reserve1)
            : null,
        totalSupply:
          liquidityToken && graphPool
            ? Amount.fromRawAmount(liquidityToken, graphPool.liquidity)
            : null,
      },
    }
  }, [error, graphPool, isLoading, liquidityToken, token0, token1])
}
