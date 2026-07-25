'use client'

import {
  type LaunchpadCandle,
  type LaunchpadCandleSnapshot,
  type LaunchpadCreator,
  type LaunchpadMetrics,
  type LaunchpadToken,
  type LaunchpadTokenConnection,
  type LaunchpadTokenRef,
  type LaunchpadTradeConnection,
  getLaunchpadCandles,
  getLaunchpadCreator,
  getLaunchpadQuoteTokenList,
  getLaunchpadToken,
  getLaunchpadTokens,
  getLaunchpadTrades,
} from '@sushiswap/graph-client/data-api'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SUSHI_DATA_API_HOST } from 'src/lib/constants'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { z } from 'zod'
import { type LaunchpadChainId, isLaunchpadChainId } from '../constants'
import type {
  LaunchpadCandlesInput,
  LaunchpadTokensInput,
  LaunchpadTradesInput,
} from '../types'
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
  refetchLaunchpadCandleSnapshotsWithRetry,
  subscribeToLaunchpadCandleSnapshot,
} from './launchpad-stream'

const EMPTY_TOKEN_CONNECTION: LaunchpadTokenConnection = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
  totalCount: 0,
}

const EMPTY_QUOTE_TOKEN_LIST: LaunchpadTokenRef[] = []
const EMPTY_CANDLE_SNAPSHOT: LaunchpadCandleSnapshot = {
  streamCursor: '0',
  nodes: [],
}

const evmAddressSchema = z
  .string()
  .refine((value) => isAddress(value, { strict: false }))
  .transform((value) => value as EvmAddress)
const transactionHashSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{64}$/)
  .transform((value) => value as `0x${string}`)
const unsignedIntegerSchema = z.string().regex(/^(0|[1-9][0-9]*)$/)
const streamIdentitySchema = z.object({
  chainId: z
    .number()
    .int()
    .refine(isLaunchpadChainId)
    .transform((value) => value as LaunchpadChainId),
  tokenAddress: evmAddressSchema,
  eventId: unsignedIntegerSchema,
})
const streamTradeSchema = streamIdentitySchema.extend({
  id: z.string().min(1),
  poolAddress: evmAddressSchema,
  feeTier: z.number().int().nonnegative(),
  isLaunchPool: z.boolean(),
  transactionHash: transactionHashSchema,
  logIndex: z.number().int().nonnegative(),
  blockNumber: unsignedIntegerSchema,
  timestamp: z.string().datetime(),
  trader: evmAddressSchema.nullable(),
  direction: z.enum(['BUY', 'SELL']),
  tokenAmount: unsignedIntegerSchema,
  quoteToken: z.object({
    address: evmAddressSchema,
    symbol: z.string().min(1),
    name: z.string().min(1),
    decimals: z.number().int().nonnegative(),
  }),
  quoteAmount: unsignedIntegerSchema,
  priceUsd: z.number().nonnegative().nullable(),
  amountUsd: z.number().nonnegative().nullable(),
})
const streamTradeRemoveSchema = streamIdentitySchema.extend({
  transactionHash: transactionHashSchema,
  logIndex: z.number().int().nonnegative(),
})
const streamResetSchema = streamIdentitySchema.extend({
  reason: z.enum(['CURSOR_EXPIRED', 'CURSOR_INVALID']),
})
const candleIntervalSchema = z.enum(['1m', '5m', '15m', '1h', '4h', '1d'])
const candleSchema = z.object({
  timestamp: z.number().int().nonnegative(),
  open: z.number().nonnegative(),
  high: z.number().nonnegative(),
  low: z.number().nonnegative(),
  close: z.number().nonnegative(),
  volumeUsd: z.number().nonnegative(),
  tradeCount: z.number().int().nonnegative(),
})
const streamCandleSchema = streamIdentitySchema.extend({
  interval: candleIntervalSchema,
  candle: candleSchema,
})
const streamCandleRemoveSchema = streamIdentitySchema.extend({
  interval: candleIntervalSchema,
  timestamp: z.number().int().nonnegative(),
})
const nullableWindowValuesSchema = z.object({
  h1: z.number().nullable(),
  h6: z.number().nullable(),
  h12: z.number().nullable(),
  h24: z.number().nullable(),
})
const metricsSchema = z.object({
  priceUsd: z.number().nonnegative().nullable(),
  fullyDilutedValuationUsd: z.number().nonnegative().nullable(),
  currentTvlUsd: z.number().nonnegative().nullable(),
  volumeUsd: nullableWindowValuesSchema,
  tvlChangePercent: nullableWindowValuesSchema,
  asOf: z.string().datetime(),
  source: z.string().min(1),
  isStale: z.boolean(),
})
const streamMetricsSchema = streamIdentitySchema.extend({
  version: unsignedIntegerSchema,
  metrics: metricsSchema,
})

function parseStreamEvent<T>(
  event: MessageEvent<string>,
  schema: z.ZodType<T>,
): T | null {
  try {
    const parsed: unknown = JSON.parse(event.data)
    const result = schema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

function isExpectedStream(
  chainId: LaunchpadChainId,
  tokenAddress: EvmAddress,
  event: { chainId: number; tokenAddress: EvmAddress },
): boolean {
  return (
    event.chainId === chainId &&
    event.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
  )
}

export function useLaunchpadQuoteTokens(chainId: LaunchpadChainId) {
  const query = useQuery({
    queryKey: ['launchpad', 'quote-token-list', chainId],
    queryFn: () => getLaunchpadQuoteTokenList({ chainId }),
    staleTime: 60_000,
  })

  return { ...query, data: query.data ?? EMPTY_QUOTE_TOKEN_LIST }
}

export function useLaunchpadTokens(input: LaunchpadTokensInput) {
  const query = useInfiniteQuery({
    queryKey: ['launchpad', 'tokens', input],
    queryFn: ({ pageParam }) => {
      const { after: _after, ...baseInput } = input
      return getLaunchpadTokens({
        input: pageParam ? { ...baseInput, after: pageParam } : baseInput,
      })
    },
    initialPageParam: input.after ?? null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
    staleTime: 10_000,
  })

  const data = useMemo<LaunchpadTokenConnection>(() => {
    const pages = query.data?.pages
    const firstPage = pages?.[0]
    const lastPage = pages?.at(-1)
    if (!pages || !firstPage || !lastPage) return EMPTY_TOKEN_CONNECTION

    return {
      edges: pages.flatMap((page) => page.edges),
      pageInfo: lastPage.pageInfo,
      totalCount: firstPage.totalCount,
    }
  }, [query.data?.pages])

  return { ...query, data }
}

export function useLaunchpadToken(
  chainId: LaunchpadChainId,
  address: EvmAddress,
) {
  return useQuery({
    queryKey: ['launchpad', 'token', { chainId, address }],
    queryFn: () => getLaunchpadToken({ chainId, address }),
    retry: 3,
    retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 5_000),
    staleTime: 10_000,
  })
}

export function useLaunchpadCreator(
  chainId: LaunchpadChainId,
  address: EvmAddress | undefined,
  filters: Omit<LaunchpadTokensInput, 'chainId' | 'creator'> = {},
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
        },
      })
    },
    enabled: Boolean(address),
    staleTime: 10_000,
  })

  const fallback: LaunchpadCreator | undefined = address
    ? {
        chainId,
        address,
        launchCount: 0,
        launches: EMPTY_TOKEN_CONNECTION,
      }
    : undefined

  return { ...query, data: query.data ?? fallback }
}

export function useLaunchpadTrades(
  input: LaunchpadTradesInput,
  enabled = true,
) {
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
    staleTime: 5_000,
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
    let cancelled = false

    void refetch
      .current()
      .then((result) => {
        const pages = result.data?.pages
        if (cancelled || result.isError || !pages?.[0]) return

        hasSnapshot.current = true
        setData(
          applyLaunchpadTradeMutations(
            flattenLaunchpadTradePages(pages),
            mutations.current.values(),
            includeSmallTrades,
          ),
        )
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [includeSmallTrades])

  useEffect(() => {
    if (!hasSnapshot.current || !snapshot.isSuccess) return

    setData(
      applyLaunchpadTradeMutations(
        snapshot.data,
        mutations.current.values(),
        includeSmallTrades,
      ),
    )
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
    let candleSnapshotCursor: string | undefined
    let tradeSnapshotCursor: string | undefined

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

    function handleReady() {
      setStreamStatus('live')
    }

    function handleTradeUpsert(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamTradeSchema,
      )
      if (!payload || !isExpected(payload)) return

      const { eventId, ...trade } = payload
      const mutation: LaunchpadTradeMutation = {
        eventId,
        type: 'upsert',
        trade,
      }
      mutations.current.set(getLaunchpadTradeKey(trade), mutation)
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
      mutations.current.set(getLaunchpadTradeKey(mutation), mutation)
      setData((current) =>
        applyLaunchpadTradeMutation(
          current,
          mutation,
          includeSmallTradesRef.current,
        ),
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

      source?.close()
      void refetchSnapshotAndReconnect(false, true)
    }

    function handleMetricsUpdate(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamMetricsSchema,
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
          token.address.toLowerCase() === input.tokenAddress.toLowerCase()
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

      nextSource.onopen = () => setStreamStatus('live')
      nextSource.onerror = () => setStreamStatus('reconnecting')
      nextSource.addEventListener('stream.ready', handleReady)
      nextSource.addEventListener('trade.upsert', handleTradeUpsert)
      nextSource.addEventListener('trade.remove', handleTradeRemove)
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
      }

      openStream(streamCursor, currentSynchronization)
    }

    function scheduleSnapshotRetry(): void {
      if (disposed || snapshotRetryTimer !== undefined) return

      snapshotRetryTimer = setTimeout(() => {
        snapshotRetryTimer = undefined
        void refetchSnapshotAndReconnect(false, true)
      }, 2_000)
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
      if (snapshotRetryTimer !== undefined) {
        clearTimeout(snapshotRetryTimer)
        snapshotRetryTimer = undefined
      }
      source?.close()
      source = undefined
      sourceAfterCursor = undefined
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
      if (snapshotRetryTimer !== undefined) {
        clearTimeout(snapshotRetryTimer)
      }
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

export function useLaunchpadCandles(input: LaunchpadCandlesInput) {
  const query = useQuery({
    queryKey: ['launchpad', 'candles', input],
    queryFn: () => getLaunchpadCandles({ input }),
    staleTime: 10_000,
  })

  return { ...query, data: query.data ?? EMPTY_CANDLE_SNAPSHOT }
}
