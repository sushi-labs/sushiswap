'use client'

import { getBladePoolTxSourcesChart } from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { BladeChainId } from 'sushi/evm'
import type { Address } from 'viem'

interface UsePoolTransactionSourcesDataParams {
  poolAddress: Address
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
