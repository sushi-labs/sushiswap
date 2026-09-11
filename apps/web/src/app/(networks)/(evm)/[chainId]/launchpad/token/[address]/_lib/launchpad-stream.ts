import type {
  LaunchpadCandle,
  LaunchpadCandleSnapshot,
  LaunchpadTrade,
  LaunchpadTradeConnection,
} from '@sushiswap/graph-client/data-api'
import ms from 'ms'
import { type EvmAddress, type EvmTxHash, normalizeEvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../../../constants'

export const EMPTY_TRADE_CONNECTION: LaunchpadTradeConnection = {
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
  streamCursor: '0',
  totalCount: 0,
}

export type LaunchpadTradeMutation =
  | { eventId: string; type: 'upsert'; trade: LaunchpadTrade }
  | {
      eventId: string
      type: 'remove'
      transactionHash: EvmTxHash
      logIndex: number
    }

/**
 * The shape `marketStats` folding needs out of a `trade.upsert`: enough to
 * decide whether the event is new to a snapshot, and what it adds if it is.
 */
export interface LaunchpadTradeStreamEvent {
  amountUsd: number | null
  direction: 'BUY' | 'SELL'
  eventId: string
  isNew: boolean
  marginalPriceUsd: number | null
  timestamp: string
  tradeKey: string
}

export interface LaunchpadTradeStreamSubscriber {
  onReset: () => void
  onTrade: (event: LaunchpadTradeStreamEvent) => void
}

export type LaunchpadCandleStreamInterval =
  | '1m'
  | '5m'
  | '15m'
  | '1h'
  | '4h'
  | '1d'

interface LaunchpadCandleStreamUpdate {
  candle: LaunchpadCandle
  eventId: string
  interval: LaunchpadCandleStreamInterval
}

interface LaunchpadCandleStreamRemoval {
  eventId: string
  interval: LaunchpadCandleStreamInterval
  timestamp: number
}

type LaunchpadCandleStreamMutation =
  | { type: 'upsert'; update: LaunchpadCandleStreamUpdate }
  | { type: 'remove'; removal: LaunchpadCandleStreamRemoval }

interface LaunchpadCandleStreamSubscriber {
  onRemove: (removal: LaunchpadCandleStreamRemoval) => void
  onReset: (fresh: boolean) => Promise<string | null>
  onUpdate: (update: LaunchpadCandleStreamUpdate) => void
}

export interface LaunchpadCandleSnapshotRefreshResult {
  failedSubscriberCount: number
  streamCursor: string | null
  subscriberCount: number
}

const tradeStreamSubscribers = new Map<
  string,
  Set<LaunchpadTradeStreamSubscriber>
>()
const candleSubscribers = new Map<
  string,
  Set<LaunchpadCandleStreamSubscriber>
>()
const candleSnapshotCursors = new Map<string, string>()
const candleSnapshotListeners = new Map<
  string,
  Set<(streamCursor: string) => void>
>()
const candleMutations = new Map<
  string,
  Map<string, LaunchpadCandleStreamMutation>
>()

function getStreamIdentityKey(
  chainId: LaunchpadChainId,
  tokenAddress: EvmAddress,
): string {
  return `${chainId}:${normalizeEvmAddress(tokenAddress)}`
}

function recordCandleMutation(
  streamKey: string,
  candleKey: string,
  mutation: LaunchpadCandleStreamMutation,
): void {
  const mutations =
    candleMutations.get(streamKey) ??
    new Map<string, LaunchpadCandleStreamMutation>()
  mutations.set(candleKey, mutation)
  if (mutations.size > 1_000) {
    const oldestKey = mutations.keys().next().value
    if (oldestKey) {
      mutations.delete(oldestKey)
    }
  }
  candleMutations.set(streamKey, mutations)
}

function compareTrades(left: LaunchpadTrade, right: LaunchpadTrade): number {
  const leftBlock = BigInt(left.blockNumber)
  const rightBlock = BigInt(right.blockNumber)
  if (leftBlock !== rightBlock) return leftBlock > rightBlock ? -1 : 1
  return right.logIndex - left.logIndex
}

function shouldIncludeTrade(
  trade: LaunchpadTrade,
  includeSmallTrades: boolean,
): boolean {
  return includeSmallTrades || trade.amountUsd === null || trade.amountUsd >= 1
}

export function getLaunchpadTradeKey(trade: {
  transactionHash: EvmTxHash
  logIndex: number
}): string {
  return `${trade.transactionHash.toLowerCase()}:${trade.logIndex}`
}

export function flattenLaunchpadTradePages(
  pages: readonly LaunchpadTradeConnection[] | undefined,
): LaunchpadTradeConnection {
  const firstPage = pages?.[0]
  const lastPage = pages?.at(-1)
  if (!firstPage || !lastPage) return EMPTY_TRADE_CONNECTION

  return {
    edges: pages.flatMap((page) => page.edges),
    pageInfo: lastPage.pageInfo,
    streamCursor: firstPage.streamCursor,
    totalCount: firstPage.totalCount,
  }
}

export function applyLaunchpadTradeMutation(
  connection: LaunchpadTradeConnection,
  mutation: LaunchpadTradeMutation,
  includeSmallTrades: boolean,
): LaunchpadTradeConnection {
  const mutationKey = getLaunchpadTradeKey(
    mutation.type === 'remove' ? mutation : mutation.trade,
  )
  const hadTrade = connection.edges.some(
    ({ node }) => getLaunchpadTradeKey(node) === mutationKey,
  )
  const edges = connection.edges.filter(
    ({ node }) => getLaunchpadTradeKey(node) !== mutationKey,
  )

  if (
    mutation.type === 'remove' ||
    !shouldIncludeTrade(mutation.trade, includeSmallTrades)
  ) {
    return {
      ...connection,
      edges,
      totalCount: hadTrade
        ? Math.max(0, connection.totalCount - 1)
        : connection.totalCount,
    }
  }

  return {
    ...connection,
    edges: [{ cursor: mutation.eventId, node: mutation.trade }, ...edges].sort(
      (left, right) => compareTrades(left.node, right.node),
    ),
    totalCount: hadTrade ? connection.totalCount : connection.totalCount + 1,
  }
}

export function applyLaunchpadTradeMutations(
  connection: LaunchpadTradeConnection,
  mutations: Iterable<LaunchpadTradeMutation>,
  includeSmallTrades: boolean,
): LaunchpadTradeConnection {
  let next = connection
  for (const mutation of mutations) {
    next = applyLaunchpadTradeMutation(next, mutation, includeSmallTrades)
  }
  return next
}

export function reconcileLaunchpadTradeResetSnapshot(
  snapshot: LaunchpadTradeConnection,
  resetEventId: string,
  bufferedMutations: Iterable<LaunchpadTradeMutation>,
  includeSmallTrades: boolean,
): {
  connection: LaunchpadTradeConnection
  mutations: LaunchpadTradeMutation[]
} | null {
  if (BigInt(snapshot.streamCursor) < BigInt(resetEventId)) return null

  const mutations = [...bufferedMutations].filter(
    (mutation) => BigInt(mutation.eventId) > BigInt(snapshot.streamCursor),
  )
  return {
    connection: applyLaunchpadTradeMutations(
      snapshot,
      mutations,
      includeSmallTrades,
    ),
    mutations,
  }
}

export function minimumLaunchpadStreamCursor(
  ...streamCursors: [string, ...string[]]
): string {
  return streamCursors.reduce((minimum, streamCursor) =>
    BigInt(streamCursor) < BigInt(minimum) ? streamCursor : minimum,
  )
}

export function upsertLaunchpadCandle(
  candles: LaunchpadCandle[],
  incoming: LaunchpadCandle,
): LaunchpadCandle[] {
  const index = candles.findIndex(
    (candle) => candle.timestamp === incoming.timestamp,
  )
  if (index === -1) {
    return [...candles, incoming].sort(
      (left, right) => left.timestamp - right.timestamp,
    )
  }

  const next = [...candles]
  next[index] = incoming
  return next
}

export function removeLaunchpadCandle(
  candles: LaunchpadCandle[],
  timestamp: number,
): LaunchpadCandle[] {
  return candles.filter((candle) => candle.timestamp !== timestamp)
}

export function applyLaunchpadCandleStreamMutations(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  interval: LaunchpadCandleStreamInterval,
  snapshot: LaunchpadCandleSnapshot,
): LaunchpadCandleSnapshot {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  let nodes = snapshot.nodes

  for (const mutation of candleMutations.get(key)?.values() ?? []) {
    const payload =
      mutation.type === 'upsert' ? mutation.update : mutation.removal
    if (
      payload.interval !== interval ||
      BigInt(payload.eventId) <= BigInt(snapshot.streamCursor)
    ) {
      continue
    }
    nodes =
      mutation.type === 'upsert'
        ? upsertLaunchpadCandle(nodes, mutation.update.candle)
        : removeLaunchpadCandle(nodes, mutation.removal.timestamp)
  }

  return { ...snapshot, nodes }
}

export function launchpadEventsUrl(input: {
  apiBaseUrl: string
  chainId: number
  tokenAddress: string
  streamCursor: string
}): string {
  const url = new URL('/stream/launchpad/events', input.apiBaseUrl)
  url.searchParams.set('chainId', String(input.chainId))
  url.searchParams.set('tokenAddress', input.tokenAddress)
  url.searchParams.set('after', input.streamCursor)
  return url.toString()
}

export function publishLaunchpadCandleSnapshot(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  streamCursor: string,
): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  candleSnapshotCursors.set(key, streamCursor)
  for (const listener of candleSnapshotListeners.get(key) ?? []) {
    listener(streamCursor)
  }
}

export function subscribeToLaunchpadCandleSnapshot(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  listener: (streamCursor: string) => void,
): () => void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  const listeners =
    candleSnapshotListeners.get(key) ??
    new Set<(streamCursor: string) => void>()
  listeners.add(listener)
  candleSnapshotListeners.set(key, listeners)

  const streamCursor = candleSnapshotCursors.get(key)
  if (streamCursor) {
    listener(streamCursor)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      candleSnapshotListeners.delete(key)
    }
  }
}

export function clearLaunchpadCandleSnapshot(input: {
  chainId: LaunchpadChainId
  tokenAddress: EvmAddress
}): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  candleSnapshotCursors.delete(key)
}

/**
 * Trade events are published straight off the stream, before the trade list
 * applies its own small-trade filter, because `marketStats` counts every swap.
 */
export function subscribeToLaunchpadTradeStream(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  subscriber: LaunchpadTradeStreamSubscriber,
): () => void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  const subscribers =
    tradeStreamSubscribers.get(key) ?? new Set<LaunchpadTradeStreamSubscriber>()
  subscribers.add(subscriber)
  tradeStreamSubscribers.set(key, subscribers)

  return () => {
    subscribers.delete(subscriber)
    if (subscribers.size === 0) {
      tradeStreamSubscribers.delete(key)
    }
  }
}

export function publishLaunchpadTradeStreamEvent(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  event: LaunchpadTradeStreamEvent,
): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  for (const subscriber of tradeStreamSubscribers.get(key) ?? []) {
    subscriber.onTrade(event)
  }
}

export function publishLaunchpadTradeStreamReset(input: {
  chainId: LaunchpadChainId
  tokenAddress: EvmAddress
}): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  for (const subscriber of tradeStreamSubscribers.get(key) ?? []) {
    subscriber.onReset()
  }
}

export function subscribeToLaunchpadCandleStream(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  subscriber: LaunchpadCandleStreamSubscriber,
): () => void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  const subscribers =
    candleSubscribers.get(key) ?? new Set<LaunchpadCandleStreamSubscriber>()
  subscribers.add(subscriber)
  candleSubscribers.set(key, subscribers)

  return () => {
    subscribers.delete(subscriber)
    if (subscribers.size === 0) {
      candleSubscribers.delete(key)
    }
  }
}

export function publishLaunchpadCandleUpdate(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  update: LaunchpadCandleStreamUpdate,
): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  recordCandleMutation(key, `${update.interval}:${update.candle.timestamp}`, {
    type: 'upsert',
    update,
  })
  for (const subscriber of candleSubscribers.get(key) ?? []) {
    subscriber.onUpdate(update)
  }
}

export function publishLaunchpadCandleRemove(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  removal: LaunchpadCandleStreamRemoval,
): void {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  recordCandleMutation(key, `${removal.interval}:${removal.timestamp}`, {
    type: 'remove',
    removal,
  })
  for (const subscriber of candleSubscribers.get(key) ?? []) {
    subscriber.onRemove(removal)
  }
}

export async function refetchLaunchpadCandleSnapshots(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  fresh: boolean,
): Promise<string | null> {
  const result = await refetchLaunchpadCandleSnapshotsWithStatus(input, fresh)
  return result.streamCursor
}

async function refetchLaunchpadCandleSnapshotsWithStatus(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  fresh: boolean,
): Promise<LaunchpadCandleSnapshotRefreshResult> {
  const key = getStreamIdentityKey(input.chainId, input.tokenAddress)
  const subscribers = Array.from(candleSubscribers.get(key) ?? [])
  const results = await Promise.all(
    subscribers.map((subscriber) =>
      subscriber.onReset(fresh).catch(() => null),
    ),
  )
  const streamCursors = results.filter(
    (streamCursor): streamCursor is string => streamCursor !== null,
  )
  const failedSubscriberCount = results.length - streamCursors.length
  const [firstStreamCursor, ...remainingStreamCursors] = streamCursors

  if (firstStreamCursor) {
    return {
      failedSubscriberCount,
      streamCursor: minimumLaunchpadStreamCursor(
        firstStreamCursor,
        ...remainingStreamCursors,
      ),
      subscriberCount: subscribers.length,
    }
  }

  return {
    failedSubscriberCount,
    streamCursor:
      subscribers.length === 0
        ? (candleSnapshotCursors.get(key) ?? null)
        : null,
    subscriberCount: subscribers.length,
  }
}

export async function refetchLaunchpadCandleSnapshotsWithRetry(
  input: {
    chainId: LaunchpadChainId
    tokenAddress: EvmAddress
  },
  fresh: boolean,
  options: { attempts?: number; retryDelayMs?: number } = {},
): Promise<LaunchpadCandleSnapshotRefreshResult> {
  const attempts = options.attempts ?? 3
  const retryDelayMs = options.retryDelayMs ?? ms('500ms')
  let result: LaunchpadCandleSnapshotRefreshResult = {
    failedSubscriberCount: 0,
    streamCursor: null,
    subscriberCount: 0,
  }

  for (let attempt = 0; attempt < attempts; attempt++) {
    result = await refetchLaunchpadCandleSnapshotsWithStatus(input, fresh)
    if (
      result.subscriberCount === 0 ||
      (result.failedSubscriberCount === 0 && result.streamCursor !== null)
    ) {
      return result
    }

    if (attempt < attempts - 1) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, retryDelayMs * 2 ** attempt)
      })
    }
  }

  return result
}
