import { useQuery } from '@tanstack/react-query'
import { Pool } from '@sushiswap/v3-sdk'
import { getConcentratedLiquidityPoolReserves } from '../actions/getConcentratedLiquidityPoolReserves'

interface UseConcentratedLiquidityPoolReserves {
  pool: Pool | null | undefined
  enabled?: boolean
}

export const useConcentratedLiquidityPoolReserves = ({
  pool,
  enabled = true,
}: UseConcentratedLiquidityPoolReserves) => {
  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPoolReserves',
      { chainId: pool?.chainId, token0: pool?.token0, token1: pool?.token1, feeAmount: pool?.fee },
    ],
    queryFn: async () => {
      if (pool) {
        return await getConcentratedLiquidityPoolReserves({
          pool,
        })
      }

      return null
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && pool),
  })
}
