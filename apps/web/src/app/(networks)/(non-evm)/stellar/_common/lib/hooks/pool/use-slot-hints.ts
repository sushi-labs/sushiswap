'use client'

import { useQuery } from '@tanstack/react-query'
import { getOracleHints } from '../../soroban/pool-helpers'
import type { OracleHints } from '../../utils/slot-hint-helpers'

/**
 * React Query hook to fetch oracle hints (slot and checkpoint)
 * @param poolAddress - The pool contract address
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with oracle hints
 */
export function useOracleHints(
  poolAddress: string | undefined,
  enabled = true,
) {
  return useQuery<OracleHints, Error>({
    queryKey: ['pool', 'oracleHints', poolAddress],
    queryFn: async () => {
      if (!poolAddress) {
        throw new Error('Pool address is required')
      }
      return await getOracleHints(poolAddress)
    },
    enabled: enabled && !!poolAddress,
    // Oracle slots change every 60 seconds, so stale time of 5 seconds ensures fresh hints
    staleTime: 5000,
    // Cache hints for 10 seconds in case of multiple operations
    gcTime: 10000,
    // Retry on failure (minute boundary may have been crossed)
    retry: 2,
    retryDelay: 1000,
  })
}
