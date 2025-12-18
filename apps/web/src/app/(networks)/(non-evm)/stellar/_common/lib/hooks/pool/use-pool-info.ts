'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getPoolInfo } from '../../soroban/pool-helpers'
import type { PoolInfo } from '../../types/pool.type'
import { type TopPool, useTopPools } from './use-top-pools'

export const usePoolInfo = (address: string | null) => {
  const {
    data: topPoolData,
    isLoading: isTopPoolsLoading,
    isPending: isTopPoolsPending,
  } = useTopPools()
  return useQuery<(PoolInfo & { topPoolData?: TopPool }) | null>({
    queryKey: ['stellar', 'pool', 'info', address],
    queryFn: async () => {
      if (!address || !topPoolData) {
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
        topPoolData: topPoolData.find((pool) => pool.address === address),
      }
    },
    enabled:
      !!address && !!topPoolData && !isTopPoolsLoading && !isTopPoolsPending,
    staleTime: ms('10s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}
