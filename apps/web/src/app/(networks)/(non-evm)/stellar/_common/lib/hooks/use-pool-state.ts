import { useQuery } from '@tanstack/react-query'
import { getPoolState } from '../soroban/pool-helpers'

export const usePoolState = () => {
  return useQuery({
    queryKey: ['usePoolState'],
    queryFn: async () => {
      return await getPoolState()
    },
  })
}
