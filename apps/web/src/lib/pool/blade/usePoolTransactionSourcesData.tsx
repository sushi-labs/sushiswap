'use client'

import {
  getBladePoolTxSourcesChart,
  isBladeChainId,
} from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { BladeChainId, EvmAddress } from 'sushi/evm'

interface UsePoolTransactionSourcesDataParams {
  poolAddress: EvmAddress
  chainId: BladeChainId
  duration?: 'DAY' | 'WEEK' | 'MONTH' | 'ALL'
  enabled?: boolean
}

export const usePoolTransactionSourcesData = ({
  poolAddress,
  chainId,
  duration = 'DAY',
  enabled = true,
}: UsePoolTransactionSourcesDataParams) => {
  return useQuery({
    queryKey: [
      'blade',
      'pool',
      `${chainId}:${poolAddress}`,
      'transaction-sources',
      duration,
    ],
    queryFn: async () => {
      if (!isBladeChainId(chainId)) {
        throw new Error(`Invalid Blade chainId: ${chainId}`)
      }
      return await getBladePoolTxSourcesChart({
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
