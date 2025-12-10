'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getAllPools, getPoolInfo } from '../../soroban/pool-helpers'

export const usePoolInfo = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'info', address],
    queryFn: async () => {
      if (!address) return null
      return await getPoolInfo(address)
    },
    enabled: !!address,
    staleTime: ms('10s'),
  })
}

export const useAllPools = () => {
  return useQuery({
    queryKey: ['pool', 'allPools'],
    queryFn: async () => {
      return await getAllPools()
    },
    staleTime: ms('10s'),
  })
}
