import type {
  LaunchpadCandle,
  LaunchpadCandleSnapshot,
  LaunchpadTrade,
  LaunchpadTradeConnection,
} from '@sushiswap/graph-client/data-api'
import { getLaunchpadCandles } from '@sushiswap/graph-client/data-api'
import ms from 'ms'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
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

export type LaunchpadCandleStreamInterval =
  | '1m'
  | '5m'
  | '15m'
  | '1h'
  | '4h'
  | '1d'

export interface LaunchpadCandleStreamUpdate {
  candle: LaunchpadCandle
  eventId: string
  interval: LaunchpadCandleStreamInterval
}

export interface LaunchpadCandleStreamRemoval {
  eventId: string
  interval: LaunchpadCandleStreamInterval
  timestamp: number
}

type LaunchpadCandleStreamMutation =
  | { type: 'upsert'; update: LaunchpadCandleStreamUpdate }
  | { type: 'remove'; removal: LaunchpadCandleStreamRemoval }

export interface LaunchpadCandleStreamSubscriber {
  onRemove: (removal: LaunchpadCandleStreamRemoval) => void
  onReset: (fresh: boolean) => Promise<string | null>
  onUpdate: (update: LaunchpadCandleStreamUpdate) => void
}

export interface LaunchpadCandleSnapshotRefreshResult {
  failedSubscriberCount: number
  streamCursor: string | null
  subscriberCount: number
}

const INITIAL_CANDLE_PREFETCH_BUCKETS = 400
const INITIAL_CANDLE_INTERVAL_SECONDS = 5 * 60

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

interface InitialCandleSnapshotState {
  from: number
  promise: Promise<LaunchpadCandleSnapshot | null>
  to: number
}

export interface LaunchpadInitialCandleSnapshot {
  countBack: number
  from: number
  snapshot: LaunchpadCandleSnapshot
  to: number
}

/**
 * Imperative candle boundary for one mounted token page. TradingView talks to
 * this instance directly; snapshots, mutations, and listeners never escape to
 * module-global state.
 */
export class LaunchpadCandleController {
  readonly chainId: LaunchpadChainId
  readonly createdAt: string
  readonly tokenAddress: EvmAddress

  private readonly mutations = new Map<string, LaunchpadCandleStreamMutation>()
  private readonly snapshotListeners = new Set<(streamCursor: string) => void>()
  private readonly subscribers = new Set<LaunchpadCandleStreamSubscriber>()
  private disposed = false
  private initialSnapshot: InitialCandleSnapshotState | undefined
  private snapshotCursor: string | null = null

  constructor(input: {
    chainId: LaunchpadChainId
    createdAt: string
    tokenAddress: EvmAddress
  }) {
    this.chainId = input.chainId
    this.createdAt = input.createdAt
    this.tokenAddress = input.tokenAddress
  }

  applyStreamMutations(
    interval: LaunchpadCandleStreamInterval,
    snapshot: LaunchpadCandleSnapshot,
  ): LaunchpadCandleSnapshot {
    let nodes = snapshot.nodes

    for (const mutation of this.mutations.values()) {
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

  publishSnapshot(streamCursor: string): void {
    if (this.disposed) return
    this.snapshotCursor = streamCursor
    for (const listener of this.snapshotListeners) {
      listener(streamCursor)
    }
  }

  subscribeToSnapshot(listener: (streamCursor: string) => void): () => void {
    if (this.disposed) return () => undefined
    this.snapshotListeners.add(listener)
    if (this.snapshotCursor !== null) {
      listener(this.snapshotCursor)
    }

    return () => {
      this.snapshotListeners.delete(listener)
    }
  }

  subscribe(subscriber: LaunchpadCandleStreamSubscriber): () => void {
    if (this.disposed) return () => undefined
    this.subscribers.add(subscriber)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }

  publishUpdate(update: LaunchpadCandleStreamUpdate): void {
    if (this.disposed) return
    this.recordMutation(`${update.interval}:${update.candle.timestamp}`, {
      type: 'upsert',
      update,
    })
    for (const subscriber of this.subscribers) {
      subscriber.onUpdate(update)
    }
  }

  publishRemove(removal: LaunchpadCandleStreamRemoval): void {
    if (this.disposed) return
    this.recordMutation(`${removal.interval}:${removal.timestamp}`, {
      type: 'remove',
      removal,
    })
    for (const subscriber of this.subscribers) {
      subscriber.onRemove(removal)
    }
  }

  async prefetchInitialSnapshot(
    fresh = false,
  ): Promise<LaunchpadCandleSnapshot | null> {
    if (this.disposed) return null
    if (!fresh && this.initialSnapshot) return this.initialSnapshot.promise

    const to = Math.floor(Date.now() / 1_000)
    const launchTimestamp = Math.floor(Date.parse(this.createdAt) / 1_000)
    const launchBucket = Number.isFinite(launchTimestamp)
      ? Math.floor(launchTimestamp / INITIAL_CANDLE_INTERVAL_SECONDS) *
        INITIAL_CANDLE_INTERVAL_SECONDS
      : 0
    const from = Math.max(
      Math.floor(
        (to -
          INITIAL_CANDLE_INTERVAL_SECONDS * INITIAL_CANDLE_PREFETCH_BUCKETS) /
          INITIAL_CANDLE_INTERVAL_SECONDS,
      ) * INITIAL_CANDLE_INTERVAL_SECONDS,
      launchBucket,
    )
    if (from >= to) return null

    const state: InitialCandleSnapshotState = {
      from,
      promise: Promise.resolve(null),
      to,
    }
    state.promise = getLaunchpadCandles({
      input: {
        chainId: this.chainId,
        tokenAddress: this.tokenAddress,
        interval: 'FIVE_MINUTES',
        from,
        to,
        countBack: INITIAL_CANDLE_PREFETCH_BUCKETS,
        ...(fresh ? { fresh: true } : {}),
      },
    })
      .then((response) => this.applyStreamMutations('5m', response))
      .then((snapshot) => {
        if (!this.disposed && this.initialSnapshot === state) {
          this.publishSnapshot(snapshot.streamCursor)
        }
        return snapshot
      })
      .catch(() => null)
    this.initialSnapshot = state
    return state.promise
  }

  async getInitialSnapshot(input: {
    countBack: number
    from: number
    resolution: string
    seconds: number
    to: number
  }): Promise<LaunchpadInitialCandleSnapshot | null> {
    if (input.resolution !== '5') return null
    const initialSnapshot = this.initialSnapshot
    if (
      !initialSnapshot ||
      input.countBack > INITIAL_CANDLE_PREFETCH_BUCKETS ||
      input.from < initialSnapshot.from ||
      Math.ceil(input.to / input.seconds) !==
        Math.ceil(initialSnapshot.to / input.seconds)
    ) {
      return null
    }

    const snapshot = await initialSnapshot.promise
    return snapshot
      ? {
          countBack: INITIAL_CANDLE_PREFETCH_BUCKETS,
          from: initialSnapshot.from,
          snapshot,
          to: initialSnapshot.to,
        }
      : null
  }

  async refetchSnapshots(fresh: boolean): Promise<string | null> {
    const result = await this.refetchSnapshotsWithStatus(fresh)
    return result.streamCursor
  }

  async refetchSnapshotsWithRetry(
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
      result = await this.refetchSnapshotsWithStatus(fresh)
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

  dispose(): void {
    this.disposed = true
    this.initialSnapshot = undefined
    this.mutations.clear()
    this.snapshotCursor = null
    this.snapshotListeners.clear()
    this.subscribers.clear()
  }

  private recordMutation(
    candleKey: string,
    mutation: LaunchpadCandleStreamMutation,
  ): void {
    this.mutations.set(candleKey, mutation)
    if (this.mutations.size > 1_000) {
      const oldestKey = this.mutations.keys().next().value
      if (oldestKey) {
        this.mutations.delete(oldestKey)
      }
    }
  }

  private async refetchSnapshotsWithStatus(
    fresh: boolean,
  ): Promise<LaunchpadCandleSnapshotRefreshResult> {
    const subscribers = Array.from(this.subscribers)
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
      streamCursor: subscribers.length === 0 ? this.snapshotCursor : null,
      subscriberCount: subscribers.length,
    }
  }
}
