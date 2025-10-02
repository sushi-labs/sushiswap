'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchPoolLiquidity,
  fetchPoolReserves,
} from '../../soroban/pool-helpers'

export const usePoolLiquidity = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'liquidity', address],
    queryFn: async () => {
      if (!address) return null
      return await fetchPoolLiquidity(address)
    },
    enabled: !!address,
  })
}

export const usePoolReserves = (address: string | null) => {
  return useQuery({
    queryKey: ['pool', 'reserves', address],
    queryFn: async () => {
      if (!address) return null
      return await fetchPoolReserves(address)
    },
    enabled: !!address,
  })
}
