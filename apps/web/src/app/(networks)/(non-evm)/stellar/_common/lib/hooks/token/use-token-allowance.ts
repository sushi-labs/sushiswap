'use client'

import { useQuery } from '@tanstack/react-query'
import { getTokenAllowance } from '../../soroban/token-helpers'

export const useTokenAllowance = (
  owner: string | null,
  spender: string | null,
  tokenAddress: string | null,
) => {
  return useQuery({
    queryKey: ['token', 'allowance', owner, spender, tokenAddress],
    queryFn: async () => {
      if (!owner || !spender || !tokenAddress) return null
      return await getTokenAllowance(owner, spender, tokenAddress)
    },
    enabled: !!owner && !!spender && !!tokenAddress,
  })
}
