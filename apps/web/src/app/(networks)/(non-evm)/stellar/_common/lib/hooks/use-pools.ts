import { useQuery } from '@tanstack/react-query'
import { getPools } from '../soroban/dex-factory-helpers'
import type { Token } from '../types/token.type'

export interface IPool {
  name: string
  address: string
  token0Address: string
  token1Address: string
  token0: Token
  token1: Token
  liquidityUSD: number
  volumeUSD1d: number
  feeUSD1d: number
  txCount1d: number
  totalApr1d: number
}

export const usePools = () => {
  return useQuery({
    queryKey: ['usePools'],
    queryFn: async () => {
      const pools: IPool[] = await getPools()

      // TODO: rather than compose the data in getPools...
      // For each pool, get the pool details
      // Transform into a shape for the client

      return pools
    },
  })
}
