'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarContractAddress } from 'sushi/stellar'
import { getPoolInfo } from '../../soroban/pool-helpers'
import type { PoolInfo } from '../../types/pool.type'

export const usePoolInfo = (poolAddress: StellarContractAddress | null) => {
  return useQuery<PoolInfo | null>({
    queryKey: ['stellar', 'pool', 'info', poolAddress],
    queryFn: async () => {
      if (!poolAddress) {
        return null
      }
      const poolInfo = await getPoolInfo(poolAddress)
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
    enabled: Boolean(poolAddress),
    staleTime: ms('10s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) =>
      Math.min(ms('1s') * 2 ** attemptIndex, ms('10s')), // Exponential backoff
  })
}
