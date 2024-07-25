'use client'

import 'sushi/bigint-serializer'
import { useMemo } from 'react'
import { Amount } from 'sushi/currency'

import { useQuery } from '@tanstack/react-query'
import type { PoolId } from 'sushi'
import { getTokensFromPool } from '../useTokensFromPool'
import { getV2Pool, V2Pool } from '@sushiswap/graph-client/data-api'


export const useGraphPool = (pool: PoolId) => {
  const {
    data: graphPool,
    isLoading,
    error,
  } = useQuery<V2Pool | null>({
    queryKey: ['v2-pool', {...pool}],
    queryFn: async () => {
      const result = await getV2Pool({chainId: pool.chainId, address: pool.address})
      return result
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
        liquidityUSD: graphPool ? Number(graphPool?.liquidityUSD) : null,
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
