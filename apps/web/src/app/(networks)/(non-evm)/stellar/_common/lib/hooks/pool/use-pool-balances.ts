'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getPoolBalances } from '../../soroban/pool-helpers'

export const usePoolBalances = (
  address: string | null,
  connectedAddress: `G${string}` | undefined,
) => {
  return useQuery({
    queryKey: ['stellar', 'pool', 'balances', address, connectedAddress],
    queryFn: async () => {
      if (!address || !connectedAddress) {
        return null
      }
      return await getPoolBalances(address, connectedAddress)
    },
    enabled: Boolean(address && connectedAddress),
    staleTime: ms('10s'),
  })
}
