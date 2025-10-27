'use client'

import {
  type BladeChainId,
  type BladePositions,
  getBladePositions,
} from '@sushiswap/graph-client/data-api'
import { skipToken, useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export function useBladeUserPositions(args: {
  chainId: BladeChainId
  user?: EvmAddress
  enabled?: boolean
}) {
  const { chainId, user, enabled = true } = args
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
