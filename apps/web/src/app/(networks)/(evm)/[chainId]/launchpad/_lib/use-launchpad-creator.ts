'use client'

import {
  type LaunchpadCreator,
  getLaunchpadCreator,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'
import type { LaunchpadTokensInput } from '../types'
import { getLaunchpadProvidersForFilter } from './launchpad-provider'
import { EMPTY_LAUNCHPAD_TOKEN_CONNECTION } from './launchpad-query-fallbacks'

export function useLaunchpadCreator(
  chainId: LaunchpadChainId,
  address: EvmAddress | undefined,
  filters: Omit<LaunchpadTokensInput, 'chainId' | 'creator' | 'providers'> = {},
) {
  const query = useQuery({
    queryKey: ['launchpad', 'creator', { chainId, address, filters }],
    queryFn: () => {
      if (!address) throw new Error('A creator address is required')
      return getLaunchpadCreator({
        chainId,
        address,
        input: {
          ...filters,
          chainId,
          creator: address,
          providers: getLaunchpadProvidersForFilter('sushi'),
        },
      })
    },
    enabled: Boolean(address),
    staleTime: ms('10s'),
  })

  const fallback: LaunchpadCreator | undefined = address
    ? {
        chainId,
        address,
        launchCount: 0,
        launches: EMPTY_LAUNCHPAD_TOKEN_CONNECTION,
      }
    : undefined

  return { ...query, data: query.data ?? fallback }
}
