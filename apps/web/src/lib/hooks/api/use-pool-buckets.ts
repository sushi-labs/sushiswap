'use client'

import {
  getV2PoolBuckets,
  getV3PoolBuckets,
} from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  type EvmAddress,
  SushiSwapProtocol,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'

interface UsePoolGraphDataParams {
  poolAddress: EvmAddress
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId
  protocol: SushiSwapProtocol
  enabled?: boolean
}

export const usePoolBuckets = ({
  poolAddress,
  chainId,
  protocol,
  enabled = true,
}: UsePoolGraphDataParams) => {
  return useQuery({
    queryKey: ['usePoolBuckets', { poolAddress, chainId, protocol }],
    queryFn: async () => {
      const buckets =
        protocol === SushiSwapProtocol.SUSHISWAP_V2 &&
        isSushiSwapV2ChainId(chainId)
          ? await getV2PoolBuckets({
              chainId,
              address: poolAddress,
            })
          : protocol === SushiSwapProtocol.SUSHISWAP_V3 &&
              isSushiSwapV3ChainId(chainId)
            ? await getV3PoolBuckets({
                chainId,
                address: poolAddress,
              })
            : {
                dayBuckets: [],
                hourBuckets: [],
              }
      return buckets
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 3600, // 1hr
    enabled: Boolean(poolAddress && chainId && enabled),
  })
}
