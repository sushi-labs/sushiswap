'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getPoolInfo } from '../../soroban/pool-helpers'
import type { PoolInfo } from '../../types/pool.type'

export const usePoolInfo = (address: string | null) => {
  return useQuery<PoolInfo | null>({
    queryKey: ['stellar', 'pool', 'info', address],
    queryFn: async () => {
      if (!address) {
        return null
      }
      const poolInfo = await getPoolInfo(address)
      // If getPoolInfo returns null, it might be a transient error
      // Throw to trigger retry logic
      if (!poolInfo) {
        throw new Error(
          'Failed to fetch pool info - pool may not exist or RPC error',
        )
      }
      return {
        ...poolInfo,
      }
    },
    enabled: !!address,
    staleTime: ms('10s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}
