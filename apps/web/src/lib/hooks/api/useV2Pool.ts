'use client'

import {
  type V2Pool,
  getV2Pool,
  hydrateV2Pool,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { stringify } from 'src/instrumentation/bigint-json'
import { Amount } from 'sushi'
import { type PoolId, isSushiSwapV2ChainId } from 'sushi/evm'
import { getLiquidityTokenFromPool } from '../useTokensFromPool'

export const useV2Pool = (poolId: PoolId) => {
  const { chainId } = poolId

  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error('Invalid chain id')
  }

  const {
    data: pool,
    isLoading,
    error,
  } = useQuery<V2Pool | null>({
    queryKey: ['v2-pool', poolId],
    queryFn: async () => {
      const rawPool = await getV2Pool({
        chainId: chainId,
        address: poolId.address,
      })

      return rawPool ? hydrateV2Pool(rawPool) : null
    },
    queryKeyHashFn: stringify,
  })

  const liquidityToken = useMemo(() => {
    if (!pool) return undefined
    return getLiquidityTokenFromPool(pool)
  }, [pool])

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: {
        token0: pool?.token0,
        token1: pool?.token1,
        liquidityToken,
        liquidityUSD: pool?.liquidityUSD,
        reserve0: pool ? new Amount(pool.token0, pool.reserve0) : null,
        reserve1: pool ? new Amount(pool.token1, pool.reserve1) : null,
        totalSupply:
          liquidityToken && pool
            ? new Amount(liquidityToken, pool.liquidity)
            : null,
      },
    }
  }, [error, pool, isLoading, liquidityToken])
}
