'use client'

import { Pool, Pools, Protocol, parseArgs } from '@sushiswap/client'
import { useMemo } from 'react'
import useSWR from 'swr'

import { getGraphPools } from '../../api'
import { usePools } from '@sushiswap/client/hooks'

function transformGraphPool(
  graphPool: Awaited<ReturnType<typeof getGraphPools>>[0],
): Pool {
  let protocol: Protocol = Protocol.SUSHISWAP_V2
  // if (graphPool.source === 'LEGACY') protocol = Protocol.SUSHISWAP_V2
  if (graphPool.source === 'TRIDENT') {
    if (graphPool.type === 'CONSTANT_PRODUCT_POOL')
      protocol = Protocol.BENTOBOX_CLASSIC
    if (graphPool.type === 'STABLE_POOL') protocol = Protocol.BENTOBOX_STABLE
  }

  return {
    id: graphPool.id,
    address: graphPool.address,
    name: graphPool.name,
    chainId: graphPool.chainId,
    protocol: protocol,
    swapFee: Number(graphPool.swapFee) / 10000,
    twapEnabled: false,
    totalSupply: String(graphPool.liquidity),
    liquidityUSD: String(graphPool.liquidityUSD),
    volumeUSD: String(graphPool.volumeUSD),
    feeApr1h: 0,
    feeApr1d: 0,
    feeApr1w: 0,
    feeApr1m: 0,
    totalApr1h: 0,
    totalApr1d: 0,
    totalApr1w: 0,
    totalApr1m: 0,
    incentiveApr: 0,
    isIncentivized: false,
    wasIncentivized: false,
    fees1h: '0',
    fees1d: '0',
    fees1w: '0',
    fees1m: '0',
    feesChange1h: 0,
    feesChange1d: 0,
    feesChange1w: 0,
    feesChange1m: 0,
    volume1h: '0',
    volume1d: '0',
    volume1w: '0',
    volume1m: '0',
    volumeChange1h: 0,
    volumeChange1d: 0,
    volumeChange1w: 0,
    volumeChange1m: 0,
    liquidityUSDChange1h: 0,
    liquidityUSDChange1d: 0,
    liquidityUSDChange1w: 0,
    liquidityUSDChange1m: 0,
    isBlacklisted: false,
    token0: {
      id: `${graphPool.chainId}:${graphPool.token0.id}`,
      address: graphPool.token0.id,
      name: graphPool.token0.name,
      symbol: graphPool.token0.symbol,
      decimals: graphPool.token0.decimals,
    },
    token1: {
      id: `${graphPool.chainId}:${graphPool.token1.id}`,
      address: graphPool.token1.id,
      name: graphPool.token1.name,
      symbol: graphPool.token1.symbol,
      decimals: graphPool.token1.decimals,
    },
    incentives: [],
    hasEnabledSteerVault: false,
    hadEnabledSteerVault: false,
    steerVaults: [],
  } satisfies Pool
}

export function getGraphPoolsUrl(poolIds: string[]) {
  return `/pools/api/graphPools${parseArgs({ ids: poolIds })}`
}

// Returns the Pools type, to make everyone's life easier
// Updates possibly stale values with subgraph values
export const useGraphPools = (poolIds: string[]): Pools => {
  const {
    data: graphPools,
    isLoading: isGraphPoolsLoading,
    error: graphPoolsError,
  } = useSWR<Awaited<ReturnType<typeof getGraphPools>>>(
    poolIds.length > 0 ? getGraphPoolsUrl(poolIds) : null,
    async () => getGraphPools(poolIds),
  )

  const {
    data: pools,
    isLoading: isPoolsLoading,
    error: poolsError,
  } = usePools({ args: { ids: poolIds } })

  return useMemo(() => {
    if (
      (isGraphPoolsLoading && !graphPoolsError) ||
      (isPoolsLoading && !poolsError)
    ) {
      return []
    }

    if (pools || graphPools) {
      return poolIds
        .map((poolId) => {
          const pool = pools?.find((pool) => pool.id === poolId)
          const graphPool = graphPools?.find(
            (graphPool) => graphPool.id === poolId,
          )

          if (!pool && !graphPool) return undefined

          if (!graphPool) return pool
          if (!pool) return transformGraphPool(graphPool)

          return {
            ...pool,
            totalSupply: String(graphPool.liquidity),
            liquidityUSD: String(graphPool.liquidityUSD),
            volumeUSD: String(graphPool.volumeUSD),
            feeApr: Number(graphPool.apr),
            totalApr: Number(graphPool.apr) + pool.incentiveApr,
          }
        })
        .filter((pool) => pool !== undefined) as Pools
    }

    return []
  }, [
    graphPools,
    isGraphPoolsLoading,
    isPoolsLoading,
    poolIds,
    pools,
    graphPoolsError,
    poolsError,
  ])
}
