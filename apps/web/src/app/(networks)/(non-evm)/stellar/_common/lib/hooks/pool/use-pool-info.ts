'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getAllPools, getPoolInfo } from '../../soroban/pool-helpers'

export const usePoolInfo = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'info', address],
    queryFn: async () => {
      if (!address) return null
      const result = await getPoolInfo(address)
      // If getPoolInfo returns null, it might be a transient error
      // Throw to trigger retry logic
      if (!result) {
        throw new Error(
          'Failed to fetch pool info - pool may not exist or RPC error',
        )
      }
      return result
    },
    enabled: !!address,
    staleTime: ms('10s'),
    retry: 3, // Retry up to 3 times on RPC failures
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}

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
