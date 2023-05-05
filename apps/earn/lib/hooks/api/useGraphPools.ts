import { parseArgs, Pools, usePools } from '@sushiswap/client'
import { useMemo } from 'react'
import useSWR from 'swr'
import { getGraphPools } from '../../api'

export function getGraphPoolsUrl(poolIds: string[]) {
  return `/pools/api/graphPools${parseArgs({ ids: poolIds })}`
}

// Returns the Pools type, to make everyone's life easier
// Updates possibly stale values with subgraph values
export const useGraphPools = (poolIds: string[]): Pools => {
  const { data: graphPools } = useSWR<Awaited<ReturnType<typeof getGraphPools>>>(
    poolIds.length > 0 ? getGraphPoolsUrl(poolIds) : null,
    async (url) => fetch(url).then((data) => data.json())
  )

  const { data: pools } = usePools({ args: { ids: poolIds } })

  return useMemo(
    () =>
      graphPools && pools
        ? pools.map((pool) => {
            const graphPool = graphPools.find((graphPool) => graphPool.id === pool.id)

            if (!graphPool) return pool

            return {
              ...pool,
              totalSupply: String(graphPool.liquidity),
              liquidityUSD: String(graphPool.liquidityUSD),
              volumeUSD: String(graphPool.volumeUSD),
              feeApr: Number(graphPool.apr),
              totalApr: Number(graphPool.apr) + pool.incentiveApr,
            }
          })
        : [],
    [graphPools, pools]
  )
}
