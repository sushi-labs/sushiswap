'use client'

import {
  type SushiSwapV4ChainId,
  getBladePoolBuckets,
  getV2PoolBuckets,
  getV3PoolBuckets,
  getV4PoolBuckets,
  isSushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  type BladeChainId,
  type EvmAddress,
  SushiSwapProtocol,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isBladeChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import type { Hex } from 'viem'

type PoolGraphChainId =
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId
  | SushiSwapV4ChainId
  | BladeChainId

interface UsePoolGraphDataParams {
  /** The pool address, or the pool ID for V4 pools */
  poolAddress: EvmAddress | Hex
  chainId: PoolGraphChainId
  protocol: SushiSwapProtocol
  enabled?: boolean
}

const getPoolBuckets = async (
  protocol: SushiSwapProtocol,
  chainId: PoolGraphChainId,
  poolAddress: EvmAddress | Hex,
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

  if (
    protocol === SushiSwapProtocol.SUSHISWAP_V4 &&
    isSushiSwapV4ChainId(chainId)
  ) {
    return getV4PoolBuckets({
      chainId,
      poolId: poolAddress,
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
    gcTime: ms('1h'),
    enabled: Boolean(poolAddress && chainId && enabled),
  })
}
