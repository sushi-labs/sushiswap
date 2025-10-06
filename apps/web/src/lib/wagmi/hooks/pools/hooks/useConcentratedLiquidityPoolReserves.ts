import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { SushiSwapV3ChainId } from 'sushi/evm'
import { useConfig } from 'wagmi'
import { getConcentratedLiquidityPoolReserves } from '../actions/getConcentratedLiquidityPoolReserves'

interface UseConcentratedLiquidityPoolReserves {
  pool: V3Pool | null | undefined
  chainId: SushiSwapV3ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPoolReserves = ({
  pool,
  chainId,
  enabled = true,
}: UseConcentratedLiquidityPoolReserves) => {
  const config = useConfig()

  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPoolReserves',
      {
        token0: pool?.token0,
        token1: pool?.token1,
        feeAmount: pool?.swapFee,
        chainId,
      },
    ],
    queryFn: async () => {
      if (pool) {
        return getConcentratedLiquidityPoolReserves({
          pool,
          config,
        })
      }

      return null
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && pool),
  })
}
