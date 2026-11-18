'use client'

import {
  type GetV2Positions,
  type V2Position,
  getV2Positions,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export function useSushiV2UserPositions(
  args: Partial<GetV2Positions>,
  shouldFetch = true,
) {
  return useQuery<(V2Position & { value: number })[]>({
    queryKey: ['v2-positions', args],
    queryFn: async () => {
      const data = await getV2Positions(args as GetV2Positions)
      return data.map((i) => {
        const value =
          (Number(i.unstakedBalance + i.stakedBalance) /
            Number(i.pool.liquidity)) *
          Number(i.pool.liquidityUSD)
        return {
          ...i,
          value,
        }
      })
    },
    enabled: Boolean(shouldFetch && args.chainId && args.user),
  })
}
