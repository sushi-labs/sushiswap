'use client'

import {
  type LaunchpadCandle,
  type LaunchpadCandleSnapshot,
  type LaunchpadMetrics,
  type LaunchpadToken,
  type LaunchpadTradeConnection,
  getLaunchpadCandles,
  getLaunchpadTrades,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ms from 'ms'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SUSHI_DATA_API_HOST } from 'src/lib/constants'
import type { EvmAddress } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import type { LaunchpadTradesInput } from '../../../types'
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
  streamMetricsSchema,
  streamResetSchema,
  streamTradeRemoveSchema,
  streamTradeSchema,
  tradeSnapshotRetryBaseDelay,
  tradeSnapshotRetryMaxDelay,
  unsignedIntegerSchema,
} from './launchpad-live-trade-events'
import {
  EMPTY_TRADE_CONNECTION,
  type LaunchpadTradeMutation,
  applyLaunchpadTradeMutation,
  applyLaunchpadTradeMutations,
  flattenLaunchpadTradePages,
  getLaunchpadTradeKey,
  launchpadEventsUrl,
  minimumLaunchpadStreamCursor,
  publishLaunchpadCandleRemove,
  publishLaunchpadCandleUpdate,
  publishLaunchpadTradeStreamEvent,
  publishLaunchpadTradeStreamReset,
  reconcileLaunchpadTradeResetSnapshot,
  refetchLaunchpadCandleSnapshotsWithRetry,
  subscribeToLaunchpadCandleSnapshot,
} from './launchpad-stream'

export {
  parseLaunchpadMetricsStreamEvent,
  parseLaunchpadTradeResetStreamEvent,
  parseLaunchpadTradeStreamEvent,
} from './launchpad-live-trade-events'

function useLaunchpadTrades(input: LaunchpadTradesInput, enabled = true) {
  const query = useInfiniteQuery({
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

  const data = useMemo(
    () => flattenLaunchpadTradePages(query.data?.pages),
    [query.data?.pages],
  )

  return { ...query, data }
}

export function useLaunchpadLiveTrades(input: LaunchpadTradesInput) {
  const queryClient = useQueryClient()
  const snapshot = useLaunchpadTrades(input, false)
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
  const includeSmallTrades = input.includeSmallTrades ?? false
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
      snapshot.data,
      mutations.current.values(),
      includeSmallTrades,
    )
    setData(next)
  }, [includeSmallTrades, snapshot.data, snapshot.isSuccess])

  useEffect(() => {
    const streamIdentity = {
      chainId: input.chainId,
      tokenAddress: input.tokenAddress,
    }
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

    async function fetchBootstrapCandleSnapshot(
      fresh: boolean,
    ): Promise<LaunchpadCandleSnapshot> {
      const to = Math.floor(Date.now() / 1_000)
      const from = to - 24 * 60 * 60

      return getLaunchpadCandles({
        input: {
          chainId: input.chainId,
          tokenAddress: input.tokenAddress,
          interval: 'ONE_HOUR',
          from,
          to,
          ...(fresh ? { fresh: true } : {}),
        },
      })
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
      publishLaunchpadTradeStreamEvent(streamIdentity, {
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
      publishLaunchpadTradeStreamReset(streamIdentity)
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
      publishLaunchpadCandleUpdate(streamIdentity, {
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
      publishLaunchpadCandleRemove(streamIdentity, {
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
      synchronized: boolean
    }> {
      const result = await refetchLaunchpadCandleSnapshotsWithRetry(
        streamIdentity,
        true,
      )
      return {
        streamCursor: result.streamCursor,
        synchronized:
          result.subscriberCount === 0 ||
          (result.failedSubscriberCount === 0 && result.streamCursor !== null),
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
        const knownCandleCursor = candleSnapshotCursor
        const [result, bootstrapCandleSnapshot, candleRefresh] =
          await Promise.all([
            refetch.current(),
            refetchCandles || !knownCandleCursor
              ? fetchBootstrapCandleSnapshot(refetchCandles)
              : Promise.resolve(null),
            refetchCandles
              ? refreshActiveCandleSnapshots()
              : Promise.resolve({
                  streamCursor: knownCandleCursor ?? null,
                  synchronized: true,
                }),
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
          bootstrapCandleSnapshot?.streamCursor,
          candleRefresh.streamCursor,
        ].filter(
          (streamCursor): streamCursor is string =>
            unsignedIntegerSchema.safeParse(streamCursor).success,
        )
        const [firstCandleCursor, ...remainingCandleCursors] = candleCursors
        if (!firstCandleCursor) {
          setStreamStatus('reconnecting')
          scheduleSnapshotRetry()
          return
        }
        candleSnapshotCursor = minimumLaunchpadStreamCursor(
          firstCandleCursor,
          ...remainingCandleCursors,
        )
        hasSnapshot.current = true
        setData(next)
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
      publishLaunchpadTradeStreamReset(streamIdentity)
      void refetchMetrics()
      void refetchSnapshotAndReconnect(false, true)
    }

    const unsubscribeCandleSnapshot = subscribeToLaunchpadCandleSnapshot(
      streamIdentity,
      (streamCursor) => {
        if (!unsignedIntegerSchema.safeParse(streamCursor).success) return
        candleSnapshotCursor = streamCursor
        openStreamFromSnapshots(synchronization.current)
      },
    )

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
  }, [input.chainId, input.tokenAddress, queryClient])

  return {
    ...snapshot,
    data,
    streamStatus,
    lastEventAt,
  }
}
