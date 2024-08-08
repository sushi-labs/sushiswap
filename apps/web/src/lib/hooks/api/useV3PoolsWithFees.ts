'use client'

import {
  GetSushiV3PoolsWithFees,
  SushiV3PoolsWithFees,
  getSushiV3PoolsWithFees,
} from '@sushiswap/graph-client/sushi-v3'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Token } from 'sushi/currency'

export type V3PoolsWithFees = Array<
  Omit<SushiV3PoolsWithFees[number], 'token0' | 'token1'> & {
    token0: Token
    token1: Token
  }
>

export const useV3PoolsWithFees = (
  params: GetSushiV3PoolsWithFees,
  options?: Omit<UseQueryOptions<V3PoolsWithFees>, 'queryFn' | 'queryKey'>,
) =>
  useQuery({
    queryKey: [params],
    queryFn: async () => {
      const pools = await getSushiV3PoolsWithFees(params)
      return pools.map((pool) => ({
        ...pool,
        token0: new Token(pool.token0),
        token1: new Token(pool.token1),
      }))
    },
    ...options,
  })
