'use client'

import { useQuery } from '@tanstack/react-query'
import { getTokenMetadata } from '../../soroban/token-helpers'

export const useTokenMetadata = (tokenAddress: string | null) => {
  return useQuery({
    queryKey: ['token', 'metadata', tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null
      return await getTokenMetadata(tokenAddress)
    },
    enabled: !!tokenAddress,
  })
}
