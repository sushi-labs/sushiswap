'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { StellarAddress } from 'sushi/stellar'
import { getPoolBalances } from '../../soroban/pool-helpers'

export const usePoolBalances = (
  address: string | null,
  connectedAddress: StellarAddress | undefined,
) => {
  return useQuery({
    queryKey: ['stellar', 'pool', 'balances', address, connectedAddress],
    queryFn: async () => {
      if (!address || !connectedAddress) {
        throw new Error(
          'Address and connected address are required to fetch pool balances',
        )
      }
      return await getPoolBalances(address, connectedAddress)
    },
    enabled: Boolean(address && connectedAddress),
    staleTime: ms('10s'),
  })
}
