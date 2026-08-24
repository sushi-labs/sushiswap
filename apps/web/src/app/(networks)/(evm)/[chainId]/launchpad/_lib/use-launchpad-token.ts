'use client'

import {
  type LaunchpadToken,
  getLaunchpadToken,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { type EvmAddress, EvmToken } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

export type LaunchpadTokenWithCurrencies = LaunchpadToken & {
  currency: EvmToken
  quoteCurrency: EvmToken
}

function hydrateLaunchpadToken(
  token: LaunchpadToken | null,
): LaunchpadTokenWithCurrencies | null {
  if (!token) return null

  return {
    ...token,
    currency: new EvmToken({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    }),
    quoteCurrency: new EvmToken({
      chainId: token.chainId,
      ...token.pool.quoteToken,
    }),
  }
}

export function useLaunchpadToken(
  chainId: LaunchpadChainId,
  address: EvmAddress,
  initialData?: LaunchpadToken | null,
) {
  return useQuery({
    queryKey: ['launchpad', 'token', { chainId, address }],
    queryFn: () => getLaunchpadToken({ chainId, address }),
    initialData,
    select: hydrateLaunchpadToken,
    retry: 3,
    retryDelay: (attempt) => Math.min(ms('1s') * 2 ** attempt, ms('5s')),
    staleTime: ms('10s'),
  })
}
