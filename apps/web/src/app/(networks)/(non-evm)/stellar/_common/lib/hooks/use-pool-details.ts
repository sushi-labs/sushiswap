// import type { PoolState } from '@sushiswap/stellar/mock-pool'
import { useQuery } from '@tanstack/react-query'
import { getPools } from '../soroban/dex-factory-helpers'
// import { getPoolDetails } from '../soroban/pool-helpers'
import type { IPool } from './use-pools'

interface UsePoolDetailsParams {
  address: string
}

export const usePoolDetails = ({ address }: UsePoolDetailsParams) => {
  return useQuery({
    queryKey: ['usePoolDetails', address],
    queryFn: async () => {
      // Get all pools and find the one with matching address
      const pools = await getPools()
      const pool = pools.find((p) => p.address === address)

      if (!pool) {
        throw new Error(`Pool with address ${address} not found`)
      }

      // The pool already includes token0 and token1 objects from getPools()
      return pool
    },
    enabled: !!address, // Only run query if address is provided
  })
}
