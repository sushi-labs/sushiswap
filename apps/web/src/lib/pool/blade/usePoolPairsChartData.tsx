'use client'

import { getBladePoolPairsChart } from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { BladeChainId, EvmAddress } from 'sushi/evm'

interface UsePoolPairsChartDataParams {
  poolAddress: EvmAddress
  chainId: BladeChainId
  duration?: 'DAY' | 'WEEK' | 'MONTH' | 'ALL'
  enabled?: boolean
}

export const usePoolPairsChartData = ({
  poolAddress,
  chainId,
  duration = 'DAY',
  enabled = true,
}: UsePoolPairsChartDataParams) => {
  return useQuery({
    queryKey: ['blade', 'pool', `${chainId}:${poolAddress}`, 'pairs', duration],
    queryFn: async () => {
      return await getBladePoolPairsChart({
        address: poolAddress,
        chainId,
        duration,
      })
    },
    placeholderData: keepPreviousData,
    staleTime: 60000,
    gcTime: 300000,
    enabled,
  })
}
