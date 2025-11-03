'use client'

import {
  getBladePoolBuckets,
  getV2PoolBuckets,
  getV3PoolBuckets,
  isBladeChainId,
} from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  type BladeChainId,
  type EvmAddress,
  SushiSwapProtocol,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'

type UsePoolGraphDataParams = {
  poolAddress: EvmAddress
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId | BladeChainId
  protocol: SushiSwapProtocol
  enabled?: boolean
}

const getPoolBuckets = async (
  protocol: SushiSwapProtocol,
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId | BladeChainId,
  poolAddress: EvmAddress,
) => {
  if (
    protocol === SushiSwapProtocol.SUSHISWAP_V2 &&
    isSushiSwapV2ChainId(chainId)
  ) {
    return getV2PoolBuckets({
      chainId,
      address: poolAddress,
    })
  }

  if (
    protocol === SushiSwapProtocol.SUSHISWAP_V3 &&
    isSushiSwapV3ChainId(chainId)
  ) {
    return getV3PoolBuckets({
      chainId,
      address: poolAddress,
    })
  }

  if (protocol === SushiSwapProtocol.BLADE && isBladeChainId(chainId)) {
    return getBladePoolBuckets({
      chainId,
      address: poolAddress,
    })
  }

  return {
    dayBuckets: [],
    hourBuckets: [],
  }
}

export const usePoolGraphData = ({
  poolAddress,
  chainId,
  protocol,
  enabled = true,
}: UsePoolGraphDataParams) => {
  return useQuery({
    queryKey: ['usePoolGraphData', { poolAddress, chainId }],
    queryFn: async () => {
      return getPoolBuckets(protocol, chainId, poolAddress)
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 3600, // 1hr
    enabled: Boolean(poolAddress && chainId && enabled),
  })
}
