'use client'

import { getLaunchpadQuoteTokenList } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useCallback } from 'react'
import { EvmToken } from 'sushi/evm'
import type { LaunchpadChainId } from '../../constants'

const EMPTY_QUOTE_TOKEN_LIST: EvmToken[] = []

export function useLaunchpadQuoteTokens(chainId: LaunchpadChainId) {
  const select = useCallback(
    (tokens: Awaited<ReturnType<typeof getLaunchpadQuoteTokenList>>) =>
      tokens.map((token) => new EvmToken({ chainId, ...token })),
    [chainId],
  )
  const query = useQuery({
    queryKey: ['launchpad', 'quote-token-list', chainId],
    queryFn: () => getLaunchpadQuoteTokenList({ chainId }),
    select,
    staleTime: ms('1m'),
  })

  return { ...query, data: query.data ?? EMPTY_QUOTE_TOKEN_LIST }
}
