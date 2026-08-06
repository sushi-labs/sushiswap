'use client'

import { useMemo } from 'react'
import { type EvmAddress, Position } from 'sushi/evm'
import { useReadContracts } from 'wagmi'
import type { SushiSwapV4ChainId } from './config'
import { INFINITY_CL_POSITION_MANAGER_ABI } from './contract-abi'
import { decodeSushiSwapV4PoolKey, getSushiSwapV4PoolId } from './pool-key'
import type { SushiSwapV4Deployment, SushiSwapV4PositionState } from './types'
import { useSushiSwapV4Pool } from './use-sushi-swap-v4-pool'

export function useSushiSwapV4Position({
  chainId,
  deployment,
  tokenId,
}: {
  chainId: SushiSwapV4ChainId
  deployment: SushiSwapV4Deployment | undefined
  tokenId: bigint | undefined
}): SushiSwapV4PositionState {
  const reads = useReadContracts({
    contracts:
      deployment && tokenId !== undefined
        ? [
            {
              address: deployment.clPositionManager,
              abi: INFINITY_CL_POSITION_MANAGER_ABI,
              functionName: 'positions',
              args: [tokenId],
              chainId,
            },
            {
              address: deployment.clPositionManager,
              abi: INFINITY_CL_POSITION_MANAGER_ABI,
              functionName: 'ownerOf',
              args: [tokenId],
              chainId,
            },
          ]
        : [],
    allowFailure: true,
    query: {
      enabled: Boolean(deployment && tokenId !== undefined),
      refetchInterval: 10_000,
    },
  })

  const positionData = reads.data?.[0]?.result
  const owner = reads.data?.[1]?.result as EvmAddress | undefined
  const poolKey = useMemo(() => {
    if (!positionData) return undefined
    return decodeSushiSwapV4PoolKey(positionData[0])
  }, [positionData])
  const poolState = useSushiSwapV4Pool({
    chainId,
    deployment,
    poolKey,
  })

  const data = useMemo(() => {
    if (tokenId === undefined || !positionData || !poolKey) return undefined

    return {
      tokenId,
      owner,
      poolKey,
      poolId: getSushiSwapV4PoolId(poolKey),
      position: poolState?.pool
        ? new Position({
            pool: poolState.pool,
            tickLower: positionData[1],
            tickUpper: positionData[2],
            liquidity: positionData[3],
          })
        : undefined,
    }
  }, [owner, poolKey, poolState?.pool, positionData, tokenId])

  return {
    data,
    poolState,
    isInitialLoading: reads.isPending || Boolean(poolState?.isInitialLoading),
    isError: reads.isError || Boolean(poolState?.isError),
  }
}
