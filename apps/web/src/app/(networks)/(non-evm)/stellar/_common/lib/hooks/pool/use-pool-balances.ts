'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getPoolBalances } from '../../soroban/pool-helpers'

export const usePoolBalances = (
  address: string | null,
  connectedAddress: string | null,
) => {
  return useQuery({
    queryKey: ['pool', 'balances', address, connectedAddress],
    queryFn: async () => {
      if (!address || !connectedAddress) return null
      return await getPoolBalances(address, connectedAddress)
    },
    enabled: !!address && !!connectedAddress,
    staleTime: ms('10s'), // 10 seconds
  })
}
