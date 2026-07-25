import {
  type LaunchpadCandle,
  type LaunchpadCandleInterval,
  type LaunchpadCandleSnapshot,
  getLaunchpadCandles,
} from '@sushiswap/graph-client/data-api'
import { getUnixTime } from 'date-fns'
import type {
  Bar,
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString,
} from 'public/trading-view/charting_library/charting_library'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../../../constants'
import {
  type LaunchpadCandleStreamInterval,
  applyLaunchpadCandleStreamMutations,
  clearLaunchpadCandleSnapshot,
  publishLaunchpadCandleSnapshot,
  removeLaunchpadCandle,
  subscribeToLaunchpadCandleStream,
  upsertLaunchpadCandle,
} from '../../../hooks/launchpad-stream'

const SUPPORTED_RESOLUTIONS = [
  '1',
  '5',
  '15',
  '60',
  '240',
  '1D',
] as ResolutionString[]

const RESOLUTION_CONFIG = new Map<
  ResolutionString,
  {
    interval: LaunchpadCandleInterval
    seconds: number
    streamInterval: LaunchpadCandleStreamInterval
  }
>([
  [
    '1' as ResolutionString,
    { interval: 'ONE_MINUTE', seconds: 60, streamInterval: '1m' },
  ],
  [
    '5' as ResolutionString,
    { interval: 'FIVE_MINUTES', seconds: 5 * 60, streamInterval: '5m' },
  ],
  [
    '15' as ResolutionString,
    {
      interval: 'FIFTEEN_MINUTES',
      seconds: 15 * 60,
      streamInterval: '15m',
    },
  ],
  [
    '60' as ResolutionString,
    { interval: 'ONE_HOUR', seconds: 60 * 60, streamInterval: '1h' },
  ],
  [
    '240' as ResolutionString,
    { interval: 'FOUR_HOURS', seconds: 4 * 60 * 60, streamInterval: '4h' },
  ],
  [
    '1D' as ResolutionString,
    { interval: 'ONE_DAY', seconds: 24 * 60 * 60, streamInterval: '1d' },
  ],
])

const CONFIGURATION: DatafeedConfiguration = {
  supported_resolutions: SUPPORTED_RESOLUTIONS,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [],
  symbols_types: [{ name: 'Crypto', value: 'crypto' }],
}

interface LaunchpadDatafeedOptions {
  chainId: LaunchpadChainId
  onResetData?: () => void
  tokenAddress: EvmAddress
  symbol: string
  pricescale: number
}

interface Subscription {
  unsubscribe: () => void
}

interface CandleSnapshotState {
  from: number
  snapshot: LaunchpadCandleSnapshot
  to: number
}

function getResolutionConfig(resolution: ResolutionString) {
  const config = RESOLUTION_CONFIG.get(resolution)

  if (!config) {
    throw new Error(`Unsupported TradingView resolution: ${resolution}`)
  }

  return config
}

function toBar(candle: LaunchpadCandle): Bar {
  return {
    time: candle.timestamp * 1_000,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volumeUsd,
  }
}

function sortBars(candles: LaunchpadCandle[]): Bar[] {
  return candles
    .map(toBar)
    .sort((left, right) => Number(left.time) - Number(right.time))
}

export function createLaunchpadDatafeed({
  chainId,
  onResetData,
  tokenAddress,
  symbol,
  pricescale,
}: LaunchpadDatafeedOptions): IBasicDataFeed {
  const subscriptions = new Map<string, Subscription>()
  const snapshots = new Map<ResolutionString, CandleSnapshotState>()
  const cachedSnapshotReads = new Set<ResolutionString>()
  const streamIdentity = { chainId, tokenAddress }

  async function fetchCandleSnapshot({
    fresh = false,
    resolution,
    from,
    to,
  }: {
    fresh?: boolean
    resolution: ResolutionString
    from: number
    to: number
  }): Promise<LaunchpadCandleSnapshot> {
    const { interval, streamInterval } = getResolutionConfig(resolution)
    const response = await getLaunchpadCandles({
      input: {
        chainId,
        tokenAddress,
        interval,
        from,
        to,
        ...(fresh ? { fresh: true } : {}),
      },
    })
    const snapshot = applyLaunchpadCandleStreamMutations(
      streamIdentity,
      streamInterval,
      response,
    )

    const currentSnapshot = snapshots.get(resolution)
    if (!currentSnapshot || to >= currentSnapshot.to) {
      snapshots.set(resolution, { from, snapshot, to })
    }
    publishLaunchpadCandleSnapshot(streamIdentity, snapshot.streamCursor)
    return snapshot
  }

  return {
    onReady(callback) {
      setTimeout(() => callback(CONFIGURATION))
    },

    searchSymbols(_userInput, _exchange, _symbolType, onResult) {
      onResult([])
    },

    resolveSymbol(_symbolName, onResolve) {
      const symbolInfo: LibrarySymbolInfo = {
        ticker: `${tokenAddress}:${symbol}`,
        name: `${symbol} / USD`,
        description: `${symbol} / USD`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Sushi Launchpad',
        listed_exchange: 'Sushi Launchpad',
        minmov: 1,
        pricescale,
        has_intraday: true,
        has_daily: true,
        supported_resolutions: SUPPORTED_RESOLUTIONS,
        volume_precision: 2,
        data_status: 'streaming',
        format: 'price',
        currency_code: 'USD',
      }

      setTimeout(() => onResolve(symbolInfo))
    },

    async getBars(
      _symbolInfo,
      resolution,
      { from, to, countBack },
      onResult,
      onError,
    ) {
      try {
        const { seconds } = getResolutionConfig(resolution)
        const currentTime = getUnixTime(new Date())
        const requestedTo = Math.min(to, currentTime)
        const requestedFrom = Math.min(from, requestedTo - seconds * countBack)

        if (requestedFrom >= requestedTo) {
          onResult([], { noData: true })
          return
        }

        const cachedSnapshot = snapshots.get(resolution)
        const canUseCachedSnapshot =
          cachedSnapshotReads.has(resolution) &&
          cachedSnapshot !== undefined &&
          requestedFrom >= cachedSnapshot.from &&
          requestedTo <= cachedSnapshot.to + seconds
        const snapshot = canUseCachedSnapshot
          ? cachedSnapshot.snapshot
          : await fetchCandleSnapshot({
              resolution,
              from: requestedFrom,
              to: requestedTo,
            })
        if (!canUseCachedSnapshot) {
          cachedSnapshotReads.delete(resolution)
        }
        const bars = sortBars(snapshot.nodes).filter(
          (bar) =>
            Number(bar.time) >= requestedFrom * 1_000 &&
            Number(bar.time) < requestedTo * 1_000,
        )

        onResult(bars, { noData: bars.length === 0 })
      } catch (error: unknown) {
        onError(error instanceof Error ? error.message : String(error))
      }
    },

    subscribeBars(
      _symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
    ) {
      const { seconds, streamInterval } = getResolutionConfig(resolution)
      subscriptions.get(listenerGuid)?.unsubscribe()
      subscriptions.set(listenerGuid, {
        unsubscribe: subscribeToLaunchpadCandleStream(streamIdentity, {
          onUpdate(update) {
            if (update.interval !== streamInterval) return

            const state = snapshots.get(resolution)
            if (state) {
              snapshots.set(resolution, {
                ...state,
                from: Math.min(state.from, update.candle.timestamp),
                snapshot: {
                  ...state.snapshot,
                  nodes: upsertLaunchpadCandle(
                    state.snapshot.nodes,
                    update.candle,
                  ),
                },
                to: Math.max(state.to, update.candle.timestamp + seconds),
              })
            }
            onTick(toBar(update.candle))
          },
          onRemove(removal) {
            if (removal.interval !== streamInterval) return

            const state = snapshots.get(resolution)
            if (!state) return
            snapshots.set(resolution, {
              ...state,
              snapshot: {
                ...state.snapshot,
                nodes: removeLaunchpadCandle(
                  state.snapshot.nodes,
                  removal.timestamp,
                ),
              },
            })
            cachedSnapshotReads.add(resolution)
            onResetCacheNeededCallback()
          },
          async onReset(fresh) {
            const state = snapshots.get(resolution)
            if (!state) return null

            const snapshot = await fetchCandleSnapshot({
              fresh,
              resolution,
              from: state.from,
              to: state.to,
            })
            cachedSnapshotReads.add(resolution)
            onResetCacheNeededCallback()
            onResetData?.()
            return snapshot.streamCursor
          },
        }),
      })
    },

    unsubscribeBars(listenerGuid) {
      const subscription = subscriptions.get(listenerGuid)

      if (!subscription) return

      subscription.unsubscribe()
      subscriptions.delete(listenerGuid)
      if (subscriptions.size === 0) {
        clearLaunchpadCandleSnapshot(streamIdentity)
      }
    },

    getServerTime(callback) {
      callback(getUnixTime(new Date()))
    },
  }
}
