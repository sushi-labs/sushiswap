'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getAllPools } from '../../soroban/pool-helpers'

/**
 * @deprecated Use useTopPools query instead
 */
export const useAllPools = () => {
  return useQuery({
    queryKey: ['pool', 'allPools'],
    queryFn: async () => {
      return await getAllPools()
    },
    staleTime: ms('10s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}
