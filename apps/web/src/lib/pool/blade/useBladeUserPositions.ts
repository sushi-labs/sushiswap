'use client'

import {
  type BladeChainId,
  type BladePositions,
  getBladePositions,
} from '@sushiswap/graph-client/data-api'
import { skipToken, useQuery } from '@tanstack/react-query'

export function useBladeUserPositions(args: {
  chainId: BladeChainId
  user?: `0x${string}`
  enabled?: boolean
}) {
  const { chainId, user, enabled } = args
  return useQuery<BladePositions>({
    queryKey: ['blade', 'positions', { chainId, user }],
    queryFn: user
      ? () =>
          getBladePositions({
            chainId,
            user,
          })
      : skipToken,

    enabled: Boolean(enabled && chainId && user),
  })
}
