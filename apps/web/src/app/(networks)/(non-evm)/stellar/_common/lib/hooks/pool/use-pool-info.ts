'use client'

import { useQuery } from '@tanstack/react-query'
import { getPoolInfo } from '../../soroban/pool-helpers'

export const usePoolInfo = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'info', address],
    queryFn: async () => {
      if (!address) return null
      return await getPoolInfo(address)
    },
    enabled: !!address,
  })
}
