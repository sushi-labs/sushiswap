'use client'

import {
  type BladeChainId,
  type BladePositions,
  getBladePositions,
} from '@sushiswap/graph-client/data-api'
import { skipToken, useQuery } from '@tanstack/react-query'

export function useBladeUserPositions(
  args: {
    chainId: BladeChainId
    user?: `0x${string}`
  },
  shouldFetch = true,
) {
  const user = args.user
  return useQuery<BladePositions>({
    queryKey: ['blade', 'positions', args],
    queryFn: user
      ? () =>
          getBladePositions({
            chainId: args.chainId,
            user,
          })
      : skipToken,

    enabled: Boolean(shouldFetch && args.chainId && user),
  })
}
