import { useQuery } from '@tanstack/react-query'
import type {
  EvmCurrency,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'
import { useConfig } from 'wagmi'
import { getConcentratedLiquidityPool } from '../actions/getConcentratedLiquidityPool'

interface UseConcentratedLiquidityPool {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: SushiSwapV3ChainId
  feeAmount: SushiSwapV3FeeAmount | undefined
  enabled?: boolean
}

export const useConcentratedLiquidityPool = ({
  token0,
  token1,
  chainId,
  feeAmount,
  enabled = true,
}: UseConcentratedLiquidityPool) => {
  const config = useConfig()

  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPool',
      { chainId, token0, token1, feeAmount },
    ],
    queryFn: async () => {
      if (!token0 || !token1 || !feeAmount) throw new Error()
      return getConcentratedLiquidityPool({
        chainId,
        token0,
        token1,
        feeAmount,
        config,
      })
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && feeAmount && chainId && token0 && token1),
  })
}
