'use client'

import {
  type LaunchpadCandle,
  type LaunchpadMetrics,
  type LaunchpadToken,
  type LaunchpadTradeConnection,
  getLaunchpadMarketStats,
  getLaunchpadTrades,
} from '@sushiswap/graph-client/data-api'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import ms from 'ms'
import {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { EvmAddress } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import { SUSHI_DATA_API_HOST } from '../../../../../../../../lib/constants'
import type { LaunchpadChainId } from '../../../constants'
import type { LaunchpadTradesInput } from '../../../types'
import {
  type LaunchpadMarketStatsTradeEvent,
  appendLaunchpadMarketStatsTradeEvent,
  foldLaunchpadMarketStats,
} from './launchpad-market-stats'
import {
  EMPTY_TRADE_CONNECTION,
  LaunchpadCandleController,
  type LaunchpadTradeMutation,
  type LaunchpadTradeStreamEvent,
  applyLaunchpadTradeMutation,
  applyLaunchpadTradeMutations,
  flattenLaunchpadTradePages,
  getLaunchpadTradeKey,
  launchpadEventsUrl,
  minimumLaunchpadStreamCursor,
  reconcileLaunchpadTradeResetSnapshot,
} from './launchpad-stream'
import {
  closedStreamRetryDelay,
  isExpectedStream,
  parseLaunchpadMetricsStreamEvent,
  parseLaunchpadTradeResetStreamEvent,
  parseLaunchpadTradeStreamEvent,
  parseStreamEvent,
  streamCandleRemoveSchema,
  streamCandleSchema,
  streamIdentitySchema,
  streamResetSchema,
  streamTradeRemoveSchema,
  tradeSnapshotRetryBaseDelay,
  tradeSnapshotRetryMaxDelay,
  unsignedIntegerSchema,
} from './launchpad-stream-events'

const MARKET_STATS_POLL_INTERVAL = ms('10s')

function useLaunchpadTrades(input: LaunchpadTradesInput, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['launchpad', 'trades', input],
    queryFn: ({ pageParam }) => {
      const { after: _after, ...baseInput } = input
      return getLaunchpadTrades({
        input: pageParam ? { ...baseInput, after: pageParam } : baseInput,
      })
    },
    initialPageParam: input.after ?? null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
    enabled,
    staleTime: ms('5s'),
  })
}

function useLaunchpadMarketStatsController(
  chainId: LaunchpadTradesInput['chainId'],
  tokenAddress: EvmAddress,
) {
  const streamKey = `${chainId}:${tokenAddress}`
  const query = useQuery({
    queryKey: ['launchpad', 'market-stats', { chainId, tokenAddress }],
    queryFn: () =>
      getLaunchpadMarketStats({ input: { chainId, tokenAddress } }),
    refetchInterval: MARKET_STATS_POLL_INTERVAL,
    retry: 3,
    retryDelay: (attempt) => Math.min(ms('1s') * 2 ** attempt, ms('5s')),
    staleTime: MARKET_STATS_POLL_INTERVAL,
  })
  const [eventState, setEventState] = useState<{
    events: readonly LaunchpadMarketStatsTradeEvent[]
    streamKey: string
  }>({ events: [], streamKey })
  const events = eventState.streamKey === streamKey ? eventState.events : []
  const refetch = useRef(query.refetch)

  useEffect(() => {
    refetch.current = query.refetch
  }, [query.refetch])

  const onTrade = useCallback(
    (event: LaunchpadTradeStreamEvent): void => {
      setEventState((current) => ({
        events: appendLaunchpadMarketStatsTradeEvent(
          current.streamKey === streamKey ? current.events : [],
          event,
        ),
        streamKey,
      }))
    },
    [streamKey],
  )
  const onReset = useCallback((): void => {
    setEventState({ events: [], streamKey })
    void refetch.current()
  }, [streamKey])
  const data = query.data
    ? foldLaunchpadMarketStats(query.data, events)
    : query.data
  const latestNewTradeEvent =
    events.reduce<LaunchpadMarketStatsTradeEvent | null>((latest, event) => {
      if (event.insertionEventId === null) return latest
      if (latest === null || latest.insertionEventId === null) return event
      return BigInt(event.insertionEventId) > BigInt(latest.insertionEventId)
        ? event
        : latest
    }, null)

  return {
    onReset,
    onTrade,
    result: { ...query, data, latestNewTradeEvent },
  }
}

function useLaunchpadLiveTradesController(input: {
  candleController: LaunchpadCandleController
  chainId: LaunchpadTradesInput['chainId']
  onTrade: (event: LaunchpadTradeStreamEvent) => void
  onTradeReset: () => void
  tokenAddress: EvmAddress
}) {
  const queryClient = useQueryClient()
  const [includeSmallTrades, setIncludeSmallTrades] = useState(false)
  const tradesInput: LaunchpadTradesInput = {
    chainId: input.chainId,
    tokenAddress: input.tokenAddress,
    includeSmallTrades,
    first: 20,
  }
  const snapshot = useLaunchpadTrades(tradesInput, false)
  const [data, setData] = useState<LaunchpadTradeConnection>(
    EMPTY_TRADE_CONNECTION,
  )
  const [streamStatus, setStreamStatus] = useState<
    'connecting' | 'live' | 'reconnecting'
  >('connecting')
  const [lastEventAt, setLastEventAt] = useState<string | null>(null)
  const mutations = useRef(new Map<string, LaunchpadTradeMutation>())
  const hasSnapshot = useRef(false)
  const synchronization = useRef(0)
  const tradeSnapshotGeneration = useRef(0)
  const refetch = useRef(snapshot.refetch)
  const includeSmallTradesRef = useRef(includeSmallTrades)
  const previousIncludeSmallTrades = useRef(includeSmallTrades)
  includeSmallTradesRef.current = includeSmallTrades

  useEffect(() => {
    refetch.current = snapshot.refetch
  }, [snapshot.refetch])

  useEffect(() => {
    if (previousIncludeSmallTrades.current === includeSmallTrades) return
    previousIncludeSmallTrades.current = includeSmallTrades
    if (!hasSnapshot.current) return
    const currentTradeSnapshotGeneration = tradeSnapshotGeneration.current
    let cancelled = false

    void refetch
      .current()
      .then((result) => {
        const pages = result.data?.pages
        if (
          cancelled ||
          result.isError ||
          !pages?.[0] ||
          !hasSnapshot.current ||
          currentTradeSnapshotGeneration !== tradeSnapshotGeneration.current
        ) {
          return
        }

        const next = applyLaunchpadTradeMutations(
          flattenLaunchpadTradePages(pages),
          mutations.current.values(),
          includeSmallTrades,
        )
        hasSnapshot.current = true
        setData(next)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [includeSmallTrades])

  useEffect(() => {
    if (!hasSnapshot.current || !snapshot.isSuccess) return

    const next = applyLaunchpadTradeMutations(
      flattenLaunchpadTradePages(snapshot.data?.pages),
      mutations.current.values(),
      includeSmallTrades,
    )
    setData(next)
  }, [includeSmallTrades, snapshot.data?.pages, snapshot.isSuccess])

  useEffect(() => {
    const tokenQueryKey = ['launchpad', 'token'] as const
    let disposed = false
    let source: EventSource | undefined
    let sourceAfterCursor: string | undefined
    let snapshotRetryTimer: ReturnType<typeof setTimeout> | undefined
    let tradeSnapshotRetryTimer: ReturnType<typeof setTimeout> | undefined
    let closedStreamRetryTimer: ReturnType<typeof setTimeout> | undefined
    let candleSnapshotCursor: string | undefined
    let tradeSnapshotCursor: string | undefined
    let tradeSnapshotRetryAttempt = 0

    function isExpected(event: {
      chainId: number
      tokenAddress: EvmAddress
    }): boolean {
      return isExpectedStream(input.chainId, input.tokenAddress, event)
    }

    function refetchMetrics(): Promise<void> {
      return queryClient
        .refetchQueries({ queryKey: tokenQueryKey, type: 'active' })
        .then(() => undefined)
    }

    function clearClosedStreamRetry(): void {
      if (closedStreamRetryTimer === undefined) return
      clearTimeout(closedStreamRetryTimer)
      closedStreamRetryTimer = undefined
    }

    function clearTradeSnapshotRetry(): void {
      if (tradeSnapshotRetryTimer === undefined) return
      clearTimeout(tradeSnapshotRetryTimer)
      tradeSnapshotRetryTimer = undefined
    }

    function handleReady(currentSource: EventSource): void {
      if (disposed || source !== currentSource) return
      clearClosedStreamRetry()
      setStreamStatus('live')
    }

    function handleStreamError(
      currentSource: EventSource,
      hasOpened: boolean,
      streamCursor: string,
      currentSynchronization: number,
    ): void {
      if (disposed || source !== currentSource) return
      if (hasOpened) {
        setStreamStatus('reconnecting')
      }
      if (closedStreamRetryTimer !== undefined) return

      closedStreamRetryTimer = setTimeout(() => {
        closedStreamRetryTimer = undefined
        if (
          disposed ||
          source !== currentSource ||
          currentSynchronization !== synchronization.current ||
          currentSource.readyState !== EventSource.CLOSED
        ) {
          return
        }

        currentSource.close()
        source = undefined
        sourceAfterCursor = undefined
        openStream(streamCursor, currentSynchronization)
      }, closedStreamRetryDelay)
    }

    function handleTradeUpsert(event: Event) {
      const payload = parseLaunchpadTradeStreamEvent(
        event as MessageEvent<string>,
      )
      if (!payload || !isExpected(payload)) return

      const { eventId, isNew, ...trade } = payload
      const mutation: LaunchpadTradeMutation = {
        eventId,
        type: 'upsert',
        trade,
      }
      const tradeKey = getLaunchpadTradeKey(trade)
      mutations.current.set(tradeKey, mutation)
      input.onTrade({
        amountUsd: trade.amountUsd,
        direction: trade.direction,
        eventId,
        isNew,
        marginalPriceUsd: trade.marginalPriceUsd,
        timestamp: trade.timestamp,
        tradeKey,
      })
      setLastEventAt(trade.timestamp)
      setData((current) =>
        applyLaunchpadTradeMutation(
          current,
          mutation,
          includeSmallTradesRef.current,
        ),
      )
    }

    function handleTradeRemove(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamTradeRemoveSchema,
      )
      if (!payload || !isExpected(payload)) return

      const mutation: LaunchpadTradeMutation = {
        eventId: payload.eventId,
        type: 'remove',
        transactionHash: payload.transactionHash,
        logIndex: payload.logIndex,
      }
      const tradeKey = getLaunchpadTradeKey(mutation)
      mutations.current.set(tradeKey, mutation)
      setData((current) =>
        applyLaunchpadTradeMutation(
          current,
          mutation,
          includeSmallTradesRef.current,
        ),
      )
    }

    function handleTradeReset(event: Event) {
      const payload = parseLaunchpadTradeResetStreamEvent(
        event as MessageEvent<string>,
      )
      if (!payload || !isExpected(payload)) return

      const currentTradeSnapshotGeneration = ++tradeSnapshotGeneration.current
      const currentSynchronization = synchronization.current
      input.onTradeReset()
      clearTradeSnapshotRetry()
      tradeSnapshotRetryAttempt = 0
      tradeSnapshotCursor = undefined
      hasSnapshot.current = false
      mutations.current.clear()
      setData(EMPTY_TRADE_CONNECTION)
      setLastEventAt(null)
      void refreshTradeSnapshot(
        payload.eventId,
        currentTradeSnapshotGeneration,
        currentSynchronization,
      )
    }

    function handleCandleUpdate(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamCandleSchema,
      )
      if (!payload || !isExpected(payload)) return

      const candle: LaunchpadCandle = payload.candle
      input.candleController.publishUpdate({
        eventId: payload.eventId,
        interval: payload.interval,
        candle,
      })
    }

    function handleCandleRemove(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamCandleRemoveSchema,
      )
      if (!payload || !isExpected(payload)) return
      input.candleController.publishRemove({
        eventId: payload.eventId,
        interval: payload.interval,
        timestamp: payload.timestamp,
      })
    }

    function handleCandleReset(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamIdentitySchema,
      )
      if (!payload || !isExpected(payload)) return

      const currentSource = source
      const currentSynchronization = synchronization.current
      if (!currentSource) return

      void refreshActiveCandleSnapshots()
        .then(({ synchronized }) => {
          if (
            synchronized ||
            disposed ||
            source !== currentSource ||
            synchronization.current !== currentSynchronization
          ) {
            return
          }
          void refetchSnapshotAndReconnect(false, true)
        })
        .catch(() => {
          if (
            !disposed &&
            source === currentSource &&
            synchronization.current === currentSynchronization
          ) {
            void refetchSnapshotAndReconnect(false, true)
          }
        })
    }

    function handleMetricsUpdate(event: Event) {
      const payload = parseLaunchpadMetricsStreamEvent(
        event as MessageEvent<string>,
      )
      if (!payload || !isExpected(payload)) return

      const metrics: LaunchpadMetrics = {
        version: payload.version,
        ...payload.metrics,
      }
      queryClient.setQueriesData<LaunchpadToken | null>(
        { queryKey: tokenQueryKey },
        (token) =>
          token?.chainId === input.chainId &&
          isAddressEqual(token.address, input.tokenAddress)
            ? { ...token, metrics }
            : token,
      )
    }

    function handleMetricsReset(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamIdentitySchema,
      )
      if (!payload || !isExpected(payload)) return
      void refetchMetrics()
    }

    function openStream(streamCursor: string, currentSynchronization: number) {
      if (
        disposed ||
        currentSynchronization !== synchronization.current ||
        !unsignedIntegerSchema.safeParse(streamCursor).success
      ) {
        return
      }

      clearClosedStreamRetry()
      const nextSource = new EventSource(
        launchpadEventsUrl({
          apiBaseUrl: SUSHI_DATA_API_HOST,
          chainId: input.chainId,
          tokenAddress: input.tokenAddress,
          streamCursor,
        }),
      )
      source = nextSource
      sourceAfterCursor = streamCursor

      let hasOpened = false
      const markReady = () => {
        hasOpened = true
        handleReady(nextSource)
      }
      nextSource.onopen = markReady
      nextSource.onerror = () =>
        handleStreamError(
          nextSource,
          hasOpened,
          streamCursor,
          currentSynchronization,
        )
      nextSource.addEventListener('stream.ready', markReady)
      nextSource.addEventListener('trade.upsert', handleTradeUpsert)
      nextSource.addEventListener('trade.remove', handleTradeRemove)
      nextSource.addEventListener('trade.reset', handleTradeReset)
      nextSource.addEventListener('candle.update', handleCandleUpdate)
      nextSource.addEventListener('candle.remove', handleCandleRemove)
      nextSource.addEventListener('candle.reset', handleCandleReset)
      nextSource.addEventListener('metrics.update', handleMetricsUpdate)
      nextSource.addEventListener('metrics.reset', handleMetricsReset)
      nextSource.addEventListener('stream.reset', handleStreamReset)
    }

    function openStreamFromSnapshots(currentSynchronization: number): void {
      if (!tradeSnapshotCursor || !candleSnapshotCursor) return
      const streamCursor = minimumLaunchpadStreamCursor(
        tradeSnapshotCursor,
        candleSnapshotCursor,
      )

      if (source) {
        if (
          sourceAfterCursor &&
          BigInt(streamCursor) >= BigInt(sourceAfterCursor)
        ) {
          return
        }
        source.close()
        source = undefined
        sourceAfterCursor = undefined
        clearClosedStreamRetry()
      }

      openStream(streamCursor, currentSynchronization)
    }

    function scheduleSnapshotRetry(): void {
      if (disposed || snapshotRetryTimer !== undefined) return

      snapshotRetryTimer = setTimeout(() => {
        snapshotRetryTimer = undefined
        void refetchSnapshotAndReconnect(false, true)
      }, ms('2s'))
    }

    function scheduleTradeSnapshotRetry(
      resetEventId: string,
      currentTradeSnapshotGeneration: number,
      currentSynchronization: number,
    ): void {
      if (
        disposed ||
        tradeSnapshotRetryTimer !== undefined ||
        currentTradeSnapshotGeneration !== tradeSnapshotGeneration.current ||
        currentSynchronization !== synchronization.current
      ) {
        return
      }

      const retryDelay = Math.min(
        tradeSnapshotRetryBaseDelay * 2 ** tradeSnapshotRetryAttempt,
        tradeSnapshotRetryMaxDelay,
      )
      tradeSnapshotRetryAttempt += 1
      tradeSnapshotRetryTimer = setTimeout(() => {
        tradeSnapshotRetryTimer = undefined
        void refreshTradeSnapshot(
          resetEventId,
          currentTradeSnapshotGeneration,
          currentSynchronization,
        )
      }, retryDelay)
    }

    async function refreshTradeSnapshot(
      resetEventId: string,
      currentTradeSnapshotGeneration: number,
      currentSynchronization: number,
    ): Promise<void> {
      const includeSmallTrades = includeSmallTradesRef.current
      try {
        const result = await refetch.current()
        if (
          disposed ||
          currentTradeSnapshotGeneration !== tradeSnapshotGeneration.current ||
          currentSynchronization !== synchronization.current
        ) {
          return
        }

        const pages = result.data?.pages
        if (result.isError || !pages?.[0]) {
          scheduleTradeSnapshotRetry(
            resetEventId,
            currentTradeSnapshotGeneration,
            currentSynchronization,
          )
          return
        }

        const next = flattenLaunchpadTradePages(pages)
        const reconciliation = unsignedIntegerSchema.safeParse(
          next.streamCursor,
        ).success
          ? reconcileLaunchpadTradeResetSnapshot(
              next,
              resetEventId,
              mutations.current.values(),
              includeSmallTrades,
            )
          : null
        if (
          !reconciliation ||
          includeSmallTrades !== includeSmallTradesRef.current
        ) {
          scheduleTradeSnapshotRetry(
            resetEventId,
            currentTradeSnapshotGeneration,
            currentSynchronization,
          )
          return
        }

        const pendingMutations = new Map<string, LaunchpadTradeMutation>()
        for (const mutation of reconciliation.mutations) {
          const trade = mutation.type === 'upsert' ? mutation.trade : mutation
          pendingMutations.set(getLaunchpadTradeKey(trade), mutation)
        }
        mutations.current = pendingMutations
        tradeSnapshotCursor = next.streamCursor
        tradeSnapshotRetryAttempt = 0
        hasSnapshot.current = true
        setData(reconciliation.connection)
      } catch {
        scheduleTradeSnapshotRetry(
          resetEventId,
          currentTradeSnapshotGeneration,
          currentSynchronization,
        )
      }
    }

    async function refreshActiveCandleSnapshots(): Promise<{
      streamCursor: string | null
      subscriberCount: number
      synchronized: boolean
    }> {
      const result =
        await input.candleController.refetchSnapshotsWithRetry(true)
      return {
        streamCursor: result.streamCursor,
        subscriberCount: result.subscriberCount,
        synchronized:
          result.subscriberCount === 0 ||
          (result.failedSubscriberCount === 0 && result.streamCursor !== null),
      }
    }

    async function refreshCandleSnapshot(refetchCandles: boolean): Promise<{
      streamCursor: string | null
      synchronized: boolean
    }> {
      if (!refetchCandles) {
        const initialSnapshot =
          await input.candleController.prefetchInitialSnapshot()
        return {
          streamCursor:
            candleSnapshotCursor ?? initialSnapshot?.streamCursor ?? null,
          synchronized:
            candleSnapshotCursor !== undefined || initialSnapshot !== null,
        }
      }

      const refresh = await refreshActiveCandleSnapshots()
      if (refresh.subscriberCount > 0) return refresh

      const initialSnapshot =
        await input.candleController.prefetchInitialSnapshot(true)
      return {
        streamCursor: initialSnapshot?.streamCursor ?? null,
        synchronized: initialSnapshot !== null,
      }
    }

    async function refetchSnapshotAndReconnect(
      clearData: boolean,
      refetchCandles: boolean,
    ): Promise<void> {
      const currentSynchronization = ++synchronization.current
      tradeSnapshotGeneration.current += 1
      clearTradeSnapshotRetry()
      tradeSnapshotRetryAttempt = 0
      if (snapshotRetryTimer !== undefined) {
        clearTimeout(snapshotRetryTimer)
        snapshotRetryTimer = undefined
      }
      source?.close()
      source = undefined
      sourceAfterCursor = undefined
      clearClosedStreamRetry()
      tradeSnapshotCursor = undefined
      if (refetchCandles) {
        candleSnapshotCursor = undefined
      }
      hasSnapshot.current = false
      mutations.current.clear()
      setStreamStatus('connecting')

      if (clearData) {
        setData(EMPTY_TRADE_CONNECTION)
        setLastEventAt(null)
      }

      try {
        const [result, candleRefresh] = await Promise.all([
          refetch.current(),
          refreshCandleSnapshot(refetchCandles),
        ])
        if (disposed || currentSynchronization !== synchronization.current) {
          return
        }
        if (!candleRefresh.synchronized) {
          setStreamStatus('reconnecting')
          scheduleSnapshotRetry()
          return
        }
        const pages = result.data?.pages
        if (result.isError || !pages?.[0]) {
          setStreamStatus('reconnecting')
          scheduleSnapshotRetry()
          return
        }

        const next = flattenLaunchpadTradePages(pages)
        tradeSnapshotCursor = next.streamCursor
        const candleCursors = [
          candleSnapshotCursor,
          candleRefresh.streamCursor,
        ].filter(
          (streamCursor): streamCursor is string =>
            unsignedIntegerSchema.safeParse(streamCursor).success,
        )
        const [firstCandleCursor, ...remainingCandleCursors] = candleCursors
        hasSnapshot.current = true
        setData(next)
        if (!firstCandleCursor) {
          return
        }
        candleSnapshotCursor = minimumLaunchpadStreamCursor(
          firstCandleCursor,
          ...remainingCandleCursors,
        )
        openStreamFromSnapshots(currentSynchronization)
      } catch {
        if (!disposed && currentSynchronization === synchronization.current) {
          setStreamStatus('reconnecting')
          scheduleSnapshotRetry()
        }
      }
    }

    function handleStreamReset(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamResetSchema,
      )
      if (!payload || !isExpected(payload)) return

      source?.close()
      input.onTradeReset()
      void refetchMetrics()
      void refetchSnapshotAndReconnect(false, true)
    }

    const unsubscribeCandleSnapshot =
      input.candleController.subscribeToSnapshot((streamCursor) => {
        if (!unsignedIntegerSchema.safeParse(streamCursor).success) return
        candleSnapshotCursor = streamCursor
        openStreamFromSnapshots(synchronization.current)
      })

    setData(EMPTY_TRADE_CONNECTION)
    setStreamStatus('connecting')
    setLastEventAt(null)
    hasSnapshot.current = false
    mutations.current.clear()
    void refetchSnapshotAndReconnect(true, false)

    return () => {
      disposed = true
      synchronization.current += 1
      tradeSnapshotGeneration.current += 1
      if (snapshotRetryTimer !== undefined) {
        clearTimeout(snapshotRetryTimer)
      }
      clearTradeSnapshotRetry()
      clearClosedStreamRetry()
      unsubscribeCandleSnapshot()
      source?.close()
    }
  }, [
    input.candleController,
    input.chainId,
    input.onTrade,
    input.onTradeReset,
    input.tokenAddress,
    queryClient,
  ])

  return {
    ...snapshot,
    data,
    includeSmallTrades,
    lastEventAt,
    setIncludeSmallTrades,
    streamStatus,
  }
}

type LaunchpadLiveMarketStats = ReturnType<
  typeof useLaunchpadMarketStatsController
>['result']
type LaunchpadLiveTrades = ReturnType<typeof useLaunchpadLiveTradesController>

const LaunchpadCandleControllerContext =
  createContext<LaunchpadCandleController | null>(null)
const LaunchpadLiveMarketStatsContext =
  createContext<LaunchpadLiveMarketStats | null>(null)
const LaunchpadLiveTradesContext = createContext<LaunchpadLiveTrades | null>(
  null,
)

interface LaunchpadLiveDataProviderProps {
  chainId: LaunchpadChainId
  children?: ReactNode
  createdAt: string
  tokenAddress: EvmAddress
}

/** Owns the token page stream even when none of its consumers are mounted. */
export function LaunchpadLiveDataProvider(
  props: LaunchpadLiveDataProviderProps,
): ReactElement {
  return (
    <LaunchpadLiveDataScope
      {...props}
      key={`${props.chainId}:${props.tokenAddress}`}
    />
  )
}

function LaunchpadLiveDataScope({
  chainId,
  children,
  createdAt,
  tokenAddress,
}: LaunchpadLiveDataProviderProps) {
  const [candleController] = useState(
    () => new LaunchpadCandleController({ chainId, createdAt, tokenAddress }),
  )

  useEffect(() => {
    return () => candleController.dispose()
  }, [candleController])

  const marketStatsController = useLaunchpadMarketStatsController(
    chainId,
    tokenAddress,
  )
  const trades = useLaunchpadLiveTradesController({
    candleController,
    chainId,
    onTrade: marketStatsController.onTrade,
    onTradeReset: marketStatsController.onReset,
    tokenAddress,
  })
  return (
    <LaunchpadCandleControllerContext.Provider value={candleController}>
      <LaunchpadLiveMarketStatsContext.Provider
        value={marketStatsController.result}
      >
        <LaunchpadLiveTradesContext.Provider value={trades}>
          {children}
        </LaunchpadLiveTradesContext.Provider>
      </LaunchpadLiveMarketStatsContext.Provider>
    </LaunchpadCandleControllerContext.Provider>
  )
}

export function useLaunchpadLiveTrades(): LaunchpadLiveTrades {
  const trades = useContext(LaunchpadLiveTradesContext)
  if (!trades) {
    throw new Error(
      'useLaunchpadLiveTrades must be used inside LaunchpadLiveDataProvider',
    )
  }
  return trades
}

export function useLaunchpadLiveMarketStats(): LaunchpadLiveMarketStats {
  const marketStats = useContext(LaunchpadLiveMarketStatsContext)
  if (!marketStats) {
    throw new Error(
      'useLaunchpadLiveMarketStats must be used inside LaunchpadLiveDataProvider',
    )
  }
  return marketStats
}

export function useLaunchpadCandleController(): LaunchpadCandleController {
  const candleController = useContext(LaunchpadCandleControllerContext)
  if (!candleController) {
    throw new Error(
      'useLaunchpadCandleController must be used inside LaunchpadLiveDataProvider',
    )
  }
  return candleController
}
