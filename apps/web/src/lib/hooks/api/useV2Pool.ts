'use client'

import { useMemo } from 'react'
import 'sushi/bigint-serializer'
import { Amount } from 'sushi/currency'

import { V2Pool, getV2Pool } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { getTokensFromPool } from '../useTokensFromPool'
import { PoolId } from 'sushi'

export const useV2Pool = (poolId: PoolId) => {
  const {
    data: pool,
    isLoading,
    error,
  } = useQuery<V2Pool | null>({
    queryKey: ['v2-pool', poolId],
    queryFn: async () => {
      const result = await getV2Pool({
        chainId: poolId.chainId,
        address: poolId.address,
      })
      return result
    },
  })

  const { token0, token1, liquidityToken } = useMemo(() => {
    if (!pool)
      return {
        token0: undefined,
        token1: undefined,
        liquidityToken: undefined,
      }

    return getTokensFromPool(pool)
  }, [pool])

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: {
        token0,
        token1,
        liquidityToken,
        liquidityUSD: pool ? Number(pool?.liquidityUSD) : null,
        reserve0:
          token0 && pool
            ? Amount.fromRawAmount(token0, pool.reserve0)
            : null,
        reserve1:
          token1 && pool
            ? Amount.fromRawAmount(token1, pool.reserve1)
            : null,
        totalSupply:
          liquidityToken && pool
            ? Amount.fromRawAmount(liquidityToken, pool.liquidity)
            : null,
      },
    }
  }, [error, pool, isLoading, liquidityToken, token0, token1])
}
