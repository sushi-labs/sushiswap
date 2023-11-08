import { SushiSwapV3ChainId, SushiSwapV3Pool } from '@sushiswap/v3-sdk'
import { useQuery } from '@tanstack/react-query'

import { getConcentratedLiquidityPoolReserves } from '../actions'

interface UseConcentratedLiquidityPoolReserves {
  pool: SushiSwapV3Pool | null | undefined
  chainId: SushiSwapV3ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPoolReserves = ({
  pool,
  chainId,
  enabled = true,
}: UseConcentratedLiquidityPoolReserves) => {
  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPoolReserves',
      {
        token0: pool?.token0,
        token1: pool?.token1,
        feeAmount: pool?.fee,
        chainId,
      },
    ],
    queryFn: async () => {
      if (pool) {
        return await getConcentratedLiquidityPoolReserves({
          pool,
          chainId,
        })
      }

      return null
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && pool),
  })
}
