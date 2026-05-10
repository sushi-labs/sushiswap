'use client'

import { type QueryClient, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import { isPoolInitialized } from '~stellar/_common/lib/soroban/pool-initialization'

const poolInitializedQueryKey = (
  address: StellarContractAddress | null | undefined,
) => ['stellar', 'pool', 'initialized', address]

export const usePoolInitialized = (
  poolAddress: StellarContractAddress | null | undefined,
) => {
  return useQuery({
    queryKey: poolInitializedQueryKey(poolAddress),
    queryFn: () => {
      if (!poolAddress) {
        return false
      }
      return isPoolInitialized(poolAddress)
    },
    enabled: Boolean(poolAddress),
    staleTime: ms('30s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) =>
      Math.min(ms('1s') * 2 ** attemptIndex, ms('10s')), // Exponential backoff
  })
}

export const invalidatePoolInitializedQuery = (
  queryClient: QueryClient,
  poolAddress: StellarContractAddress | null | undefined,
) => {
  if (!poolAddress) return

  queryClient.invalidateQueries({
    queryKey: poolInitializedQueryKey(poolAddress),
  })
}
