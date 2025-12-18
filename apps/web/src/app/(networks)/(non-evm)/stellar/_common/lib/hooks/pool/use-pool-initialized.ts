'use client'

import { type QueryClient, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { isPoolInitialized } from '~stellar/_common/lib/soroban/pool-initialization'

const poolInitializedQueryKey = (address: string | null | undefined) => [
  'stellar',
  'pool',
  'initialized',
  address,
]

export const usePoolInitialized = (address: string | null | undefined) => {
  return useQuery({
    queryKey: poolInitializedQueryKey(address),
    queryFn: () => isPoolInitialized(address!),
    enabled: !!address,
    staleTime: ms('30s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}

export const invalidatePoolInitializedQuery = (
  queryClient: QueryClient,
  address: string | null | undefined,
) => {
  if (!address) return

  queryClient.invalidateQueries({
    queryKey: poolInitializedQueryKey(address),
  })
}
