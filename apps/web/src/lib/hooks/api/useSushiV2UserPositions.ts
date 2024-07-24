'use client'

import {
  GetV2Positions,
  getV2Positions,
  V2Position,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export function useSushiV2UserPositions(
  args: GetV2Positions,
  shouldFetch = true,
) {
  return useQuery<V2Position[]>({
    queryKey: ['v2-positions', { ...args }],
    queryFn: async () => await getV2Positions(args),
    enabled: Boolean(shouldFetch && args.chainId && args.user),
  })
}
