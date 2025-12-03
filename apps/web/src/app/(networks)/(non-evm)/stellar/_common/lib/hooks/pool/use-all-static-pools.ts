'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllStaticTokenPools } from '../../soroban/pool-helpers'

/**
 * @deprecated Use useTopPools query instead

 */
export const useAllStaticTokenPools = () => {
  return useQuery({
    queryKey: ['pool', 'allStaticPools'],
    queryFn: async () => {
      return await getAllStaticTokenPools()
    },
  })
}
