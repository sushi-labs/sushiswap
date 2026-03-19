'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type {
  StellarAccountAddress,
  StellarContractAddress,
} from 'sushi/stellar'
import { getPoolBalances } from '../../soroban/pool-helpers'

export const usePoolBalances = (
  poolAddress: StellarContractAddress | null,
  connectedAddress: StellarAccountAddress | undefined,
) => {
  return useQuery({
    queryKey: ['stellar', 'pool', 'balances', poolAddress, connectedAddress],
    queryFn: async () => {
      if (!poolAddress || !connectedAddress) {
        throw new Error(
          'Address and connected address are required to fetch pool balances',
        )
      }
      return await getPoolBalances(poolAddress, connectedAddress)
    },
    enabled: Boolean(poolAddress && connectedAddress),
    staleTime: ms('10s'),
  })
}
