'use client'

import { useQuery } from '@tanstack/react-query'
import { getCurrentAndNextSlot } from '../../soroban/pool-helpers'
import type { SlotHints } from '../../utils/slot-hint-helpers'

/**
 * React Query hook to fetch current and next oracle slot hints
 * @param poolAddress - The pool contract address
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with slot hints
 */
export function useSlotHints(poolAddress: string | undefined, enabled = true) {
  return useQuery<SlotHints, Error>({
    queryKey: ['pool', 'slotHints', poolAddress],
    queryFn: async () => {
      if (!poolAddress) {
        throw new Error('Pool address is required')
      }
      return await getCurrentAndNextSlot(poolAddress)
    },
    enabled: enabled && !!poolAddress,
    // Slot hints change every 60 seconds, so stale time of 5 seconds ensures fresh hints
    staleTime: 5000,
    // Cache hints for 10 seconds in case of multiple operations
    gcTime: 10000,
    // Retry on failure (minute boundary may have been crossed)
    retry: 2,
    retryDelay: 1000,
  })
}
