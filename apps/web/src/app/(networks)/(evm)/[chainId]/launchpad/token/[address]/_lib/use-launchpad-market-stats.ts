'use client'

import { getLaunchpadMarketStats } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useEffect, useMemo, useRef, useState } from 'react'
import { type EvmAddress, normalizeEvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../../../constants'
import {
  type LaunchpadMarketStatsTradeEvent,
  appendLaunchpadMarketStatsTradeEvent,
  foldLaunchpadMarketStats,
} from './launchpad-market-stats'
import { subscribeToLaunchpadTradeStream } from './launchpad-stream'

/**
 * Matches the server's live cache, which holds the short windows for 10s and
 * collapses concurrent readers of a token into one database read. The poll is
 * the correctness guarantee, not an optimisation: it is the only thing that
 * expires trades out of a rolling window, so every kind of drift a folded
 * stream event introduces is bounded by one interval.
 */
const MARKET_STATS_POLL_INTERVAL = ms('10s')

export function useLaunchpadMarketStats(
  chainId: LaunchpadChainId,
  address: EvmAddress,
) {
  // Normalised so the token page header and the activity card, which read the
  // address from different sources, share one poll instead of two.
  const tokenAddress = normalizeEvmAddress(address)
  const query = useQuery({
    queryKey: ['launchpad', 'market-stats', { chainId, tokenAddress }],
    queryFn: () =>
      getLaunchpadMarketStats({ input: { chainId, tokenAddress } }),
    refetchInterval: MARKET_STATS_POLL_INTERVAL,
    retry: 3,
    retryDelay: (attempt) => Math.min(ms('1s') * 2 ** attempt, ms('5s')),
    staleTime: MARKET_STATS_POLL_INTERVAL,
  })
  const [events, setEvents] = useState<
    readonly LaunchpadMarketStatsTradeEvent[]
  >([])
  const refetch = useRef(query.refetch)

  useEffect(() => {
    refetch.current = query.refetch
  }, [query.refetch])

  useEffect(() => {
    return subscribeToLaunchpadTradeStream(
      { chainId, tokenAddress },
      {
        onReset: () => {
          setEvents((current) => (current.length === 0 ? current : []))
          void refetch.current()
        },
        onTrade: (event) =>
          setEvents((current) =>
            appendLaunchpadMarketStatsTradeEvent(current, event),
          ),
      },
    )
  }, [chainId, tokenAddress])

  const data = useMemo(
    () =>
      query.data ? foldLaunchpadMarketStats(query.data, events) : query.data,
    [events, query.data],
  )
  const latestNewTradeEvent =
    events.reduce<LaunchpadMarketStatsTradeEvent | null>(
      (latest, event) => (event.isNew ? event : latest),
      null,
    )

  return { ...query, data, latestNewTradeEvent }
}
