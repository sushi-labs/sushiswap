'use client'

import {
  type LaunchpadCreator,
  type LaunchpadTokenConnection,
  type LaunchpadTokenRef,
  type LaunchpadTrade,
  type LaunchpadTradeConnection,
  getLaunchpadCandles,
  getLaunchpadCreator,
  getLaunchpadQuoteTokenList,
  getLaunchpadToken,
  getLaunchpadTokens,
  getLaunchpadTrades,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
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

const EMPTY_TOKEN_CONNECTION: LaunchpadTokenConnection = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
  totalCount: 0,
}

const EMPTY_QUOTE_TOKEN_LIST: LaunchpadTokenRef[] = []

const EMPTY_TRADE_CONNECTION: LaunchpadTradeConnection = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
  hiddenSmallTradeCount: 0,
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

type StreamMutation =
  | { eventId: string; type: 'upsert'; trade: LaunchpadTrade }
  | {
      eventId: string
      type: 'remove'
      transactionHash: `0x${string}`
      logIndex: number
    }

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

function compareTrades(left: LaunchpadTrade, right: LaunchpadTrade): number {
  const leftBlock = BigInt(left.blockNumber)
  const rightBlock = BigInt(right.blockNumber)
  if (leftBlock !== rightBlock) return leftBlock > rightBlock ? -1 : 1
  return right.logIndex - left.logIndex
}

function applyStreamMutation(
  connection: LaunchpadTradeConnection,
  mutation: StreamMutation,
  limit: number,
): LaunchpadTradeConnection {
  if (mutation.type === 'remove') {
    return {
      ...connection,
      edges: connection.edges.filter(
        ({ node }) =>
          node.transactionHash.toLowerCase() !==
            mutation.transactionHash.toLowerCase() ||
          node.logIndex !== mutation.logIndex,
      ),
    }
  }

  const edges = [
    { cursor: mutation.eventId, node: mutation.trade },
    ...connection.edges.filter(
      ({ node }) =>
        node.transactionHash.toLowerCase() !==
          mutation.trade.transactionHash.toLowerCase() ||
        node.logIndex !== mutation.trade.logIndex,
    ),
  ]
    .sort((left, right) => compareTrades(left.node, right.node))
    .slice(0, limit)

  return { ...connection, edges }
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
  const query = useQuery({
    queryKey: ['launchpad', 'trades', input],
    queryFn: () => getLaunchpadTrades({ input }),
    enabled,
    staleTime: 5_000,
  })

  return { ...query, data: query.data ?? EMPTY_TRADE_CONNECTION }
}

export function useLaunchpadLiveTrades(input: LaunchpadTradesInput) {
  const snapshot = useLaunchpadTrades(input, false)
  const [data, setData] = useState<LaunchpadTradeConnection>(
    EMPTY_TRADE_CONNECTION,
  )
  const [streamStatus, setStreamStatus] = useState<
    'connecting' | 'live' | 'reconnecting'
  >('connecting')
  const [lastEventAt, setLastEventAt] = useState<string | null>(null)
  const bufferedMutations = useRef<StreamMutation[]>([])
  const isBuffering = useRef(false)
  const hasSnapshot = useRef(false)
  const synchronization = useRef(0)
  const refetch = useRef(snapshot.refetch)

  useEffect(() => {
    refetch.current = snapshot.refetch
  }, [snapshot.refetch])

  // The stream must restart when the GraphQL snapshot's small-trade filter
  // changes, even though that value is consumed indirectly by refetch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: See above.
  useEffect(() => {
    const limit = input.first ?? 50
    const url = new URL(
      `${SUSHI_DATA_API_HOST}/graphql/launchpad/events`,
      window.location.origin,
    )
    url.searchParams.set('chainId', String(input.chainId))
    url.searchParams.set('tokenAddress', input.tokenAddress)

    setData(EMPTY_TRADE_CONNECTION)
    setStreamStatus('connecting')
    setLastEventAt(null)
    bufferedMutations.current = []
    isBuffering.current = false
    hasSnapshot.current = false
    synchronization.current += 1

    const source = new EventSource(url)

    function synchronizeSnapshot() {
      const currentSynchronization = ++synchronization.current
      isBuffering.current = true
      bufferedMutations.current = []

      void refetch
        .current()
        .then((result) => {
          if (currentSynchronization !== synchronization.current) return
          if (result.isError) {
            isBuffering.current = false
            setStreamStatus('reconnecting')
            return
          }

          const next = bufferedMutations.current.reduce(
            (connection, mutation) =>
              applyStreamMutation(connection, mutation, limit),
            result.data ?? EMPTY_TRADE_CONNECTION,
          )
          bufferedMutations.current = []
          isBuffering.current = false
          hasSnapshot.current = true
          setData(next)
          setStreamStatus('live')
        })
        .catch(() => {
          if (currentSynchronization !== synchronization.current) return
          isBuffering.current = false
          setStreamStatus('reconnecting')
        })
    }

    function handleReady(event: Event) {
      const control = parseStreamEvent(
        event as MessageEvent<string>,
        streamIdentitySchema,
      )
      if (
        !control ||
        !isExpectedStream(input.chainId, input.tokenAddress, control)
      ) {
        return
      }
      synchronizeSnapshot()
    }

    function handleTradeUpsert(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamTradeSchema,
      )
      if (
        !payload ||
        !isExpectedStream(input.chainId, input.tokenAddress, payload)
      ) {
        return
      }

      const { eventId, ...trade } = payload
      const mutation: StreamMutation = { eventId, type: 'upsert', trade }
      setLastEventAt(trade.timestamp)
      if (isBuffering.current) {
        bufferedMutations.current.push(mutation)
      } else {
        setData((current) => applyStreamMutation(current, mutation, limit))
      }
    }

    function handleTradeRemove(event: Event) {
      const payload = parseStreamEvent(
        event as MessageEvent<string>,
        streamTradeRemoveSchema,
      )
      if (
        !payload ||
        !isExpectedStream(input.chainId, input.tokenAddress, payload)
      ) {
        return
      }

      const mutation: StreamMutation = {
        eventId: payload.eventId,
        type: 'remove',
        transactionHash: payload.transactionHash,
        logIndex: payload.logIndex,
      }
      if (isBuffering.current) {
        bufferedMutations.current.push(mutation)
      } else {
        setData((current) => applyStreamMutation(current, mutation, limit))
      }
    }

    source.onopen = () =>
      setStreamStatus(hasSnapshot.current ? 'live' : 'connecting')
    source.onerror = () => setStreamStatus('reconnecting')
    source.addEventListener('stream.ready', handleReady)
    source.addEventListener('stream.reset', handleReady)
    source.addEventListener('trade.upsert', handleTradeUpsert)
    source.addEventListener('trade.remove', handleTradeRemove)

    return () => {
      synchronization.current += 1
      source.close()
    }
  }, [input.chainId, input.first, input.includeSmallTrades, input.tokenAddress])

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

  return { ...query, data: query.data ?? [] }
}
