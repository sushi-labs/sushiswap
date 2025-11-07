'use client'

import { type QueryClient, useQuery } from '@tanstack/react-query'
import { isPoolInitialized } from '~stellar/_common/lib/soroban/pool-initialization'

export const poolInitializedQueryKey = (address: string | null | undefined) => [
  'pool',
  'initialized',
  address,
]

export const usePoolInitialized = (address: string | null | undefined) => {
  return useQuery({
    queryKey: poolInitializedQueryKey(address),
    queryFn: () => isPoolInitialized(address!),
    enabled: !!address,
    staleTime: 30_000,
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
