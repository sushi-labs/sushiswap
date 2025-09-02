'use client'

import {
  getBladePoolBuckets,
  getV2PoolBuckets,
  getV3PoolBuckets,
} from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { BLADE_PROTOCOL } from 'src/lib/pool/blade'
import { type Address, SushiSwapProtocol } from 'sushi'
import {
  type BladeChainId,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isBladeChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'

interface UsePoolGraphDataParams {
  poolAddress: Address
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId | BladeChainId
  protocol: SushiSwapProtocol | typeof BLADE_PROTOCOL
  enabled?: boolean
}

const getPoolBuckets = async (
  protocol: SushiSwapProtocol | typeof BLADE_PROTOCOL,
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId | BladeChainId,
  poolAddress: Address,
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

  if (protocol === BLADE_PROTOCOL && isBladeChainId(chainId)) {
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
