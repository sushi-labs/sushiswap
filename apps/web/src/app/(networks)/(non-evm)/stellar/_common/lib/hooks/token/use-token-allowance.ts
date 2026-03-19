'use client'

import { useQuery } from '@tanstack/react-query'
import {
  type StellarAddress,
  type StellarContractAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import { getTokenAllowance } from '../../soroban/token-helpers'

export const useTokenAllowance = (
  owner: StellarAddress | null,
  spender: StellarAddress | null,
  tokenAddress: StellarContractAddress | null,
) => {
  return useQuery({
    queryKey: ['stellar', 'token', 'allowance', owner, spender, tokenAddress],
    queryFn: async () => {
      if (!owner || !spender || !tokenAddress) {
        throw new Error(
          'Owner, spender, and token address are required to fetch allowance',
        )
      }
      return await getTokenAllowance(owner, spender, tokenAddress)
    },
    enabled: Boolean(
      owner &&
        spender &&
        tokenAddress &&
        isStellarContractAddress(tokenAddress),
    ),
  })
}
