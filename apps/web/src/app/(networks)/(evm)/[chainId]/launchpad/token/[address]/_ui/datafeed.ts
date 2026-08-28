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
} from '../_lib/launchpad-stream'

const SUPPORTED_RESOLUTIONS = [
  '1',
  '5',
  '15',
  '60',
  '240',
  '1D',
] as ResolutionString[]

const MAX_CANDLES_PER_REQUEST = 2_000
const ONE_DAY_SECONDS = 24 * 60 * 60

function getCandleRequestFrom(
  from: number,
  to: number,
  intervalSeconds: number,
): number {
  const alignedFrom = Math.floor(from / intervalSeconds) * intervalSeconds
  const earliestAllowedFrom =
    Math.ceil(
      (to - intervalSeconds * MAX_CANDLES_PER_REQUEST) / intervalSeconds,
    ) * intervalSeconds

  return Math.max(alignedFrom, earliestAllowedFrom)
}

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

export type LaunchpadChartMode = 'market-cap' | 'price'

export const DEFAULT_LAUNCHPAD_CHART_MODE: LaunchpadChartMode = 'market-cap'

interface LaunchpadDatafeedOptions {
  chainId: LaunchpadChainId
  getPriceMultiplier: (chartMode: LaunchpadChartMode) => number
  getPricescale: (chartMode: LaunchpadChartMode) => number
  onResetData?: () => void
  tokenAddress: EvmAddress
  symbol: string
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

export function getLaunchpadChartSymbol(
  tokenAddress: EvmAddress,
  symbol: string,
  chartMode: LaunchpadChartMode,
): string {
  return `${tokenAddress}:${symbol}:${chartMode}`
}

function getChartMode(symbolName: string | undefined): LaunchpadChartMode {
  return symbolName?.endsWith(':market-cap') ? 'market-cap' : 'price'
}

function toBar(
  candle: LaunchpadCandle,
  priceMultiplier: number,
  previousClose?: number,
): Bar {
  const open = previousClose ?? candle.open

  return {
    time: candle.timestamp * 1_000,
    open: open * priceMultiplier,
    high: Math.max(candle.high, open) * priceMultiplier,
    low: Math.min(candle.low, open) * priceMultiplier,
    close: candle.close * priceMultiplier,
    volume: candle.volumeUsd,
  }
}

function sortBars(
  candles: LaunchpadCandle[],
  priceMultiplier: number,
  previousClose?: number,
): Bar[] {
  const sortedCandles = candles
    .filter((candle) => candle.tradeCount > 0 && candle.volumeUsd > 0)
    .sort((left, right) => left.timestamp - right.timestamp)

  return sortedCandles.map((candle, index) =>
    toBar(
      candle,
      priceMultiplier,
      sortedCandles[index - 1]?.close ?? previousClose,
    ),
  )
}

function getBarsInRange(
  candles: LaunchpadCandle[],
  priceMultiplier: number,
  from: number,
  to: number,
  previousClose?: number,
): Bar[] {
  return sortBars(candles, priceMultiplier, previousClose).filter(
    (bar) => Number(bar.time) >= from * 1_000 && Number(bar.time) < to * 1_000,
  )
}

function getLatestCandleBefore(
  candles: LaunchpadCandle[],
  timestamp: number,
): LaunchpadCandle | undefined {
  let previousCandle: LaunchpadCandle | undefined

  for (const candle of candles) {
    if (
      candle.tradeCount > 0 &&
      candle.volumeUsd > 0 &&
      candle.timestamp < timestamp &&
      (!previousCandle || candle.timestamp > previousCandle.timestamp)
    ) {
      previousCandle = candle
    }
  }

  return previousCandle
}

function getPreviousClose(
  candles: LaunchpadCandle[],
  timestamp: number,
): number | undefined {
  return getLatestCandleBefore(candles, timestamp)?.close
}

export function createLaunchpadDatafeed({
  chainId,
  getPriceMultiplier,
  getPricescale,
  onResetData,
  tokenAddress,
  symbol,
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
    const { interval, seconds, streamInterval } =
      getResolutionConfig(resolution)
    const requestFrom = getCandleRequestFrom(from, to, seconds)
    const response = await getLaunchpadCandles({
      input: {
        chainId,
        tokenAddress,
        interval,
        from: requestFrom,
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
      snapshots.set(resolution, { from: requestFrom, snapshot, to })
    }
    publishLaunchpadCandleSnapshot(streamIdentity, snapshot.streamCursor)
    return snapshot
  }

  async function getSnapshotBars({
    snapshot,
    resolution,
    priceMultiplier,
    from,
    to,
  }: {
    snapshot: LaunchpadCandleSnapshot
    resolution: ResolutionString
    priceMultiplier: number
    from: number
    to: number
  }): Promise<Bar[]> {
    const bars = getBarsInRange(snapshot.nodes, priceMultiplier, from, to)
    const firstBar = bars[0]
    if (resolution !== '1' || !firstBar) return bars

    const firstTimestamp = Number(firstBar.time) / 1_000
    if (getPreviousClose(snapshot.nodes, firstTimestamp) !== undefined) {
      return bars
    }

    const { seconds } = getResolutionConfig(resolution)
    const previousSnapshot = await fetchCandleSnapshot({
      resolution,
      from: firstTimestamp - seconds * MAX_CANDLES_PER_REQUEST,
      to: firstTimestamp,
    })
    const previousClose = getPreviousClose(
      previousSnapshot.nodes,
      firstTimestamp,
    )

    return previousClose === undefined
      ? bars
      : getBarsInRange(snapshot.nodes, priceMultiplier, from, to, previousClose)
  }

  async function getLatestOneMinuteBars({
    priceMultiplier,
    to,
  }: {
    priceMultiplier: number
    to: number
  }): Promise<Bar[]> {
    const dailySnapshot = await fetchCandleSnapshot({
      resolution: '1D' as ResolutionString,
      from: to - ONE_DAY_SECONDS * MAX_CANDLES_PER_REQUEST,
      to,
    })
    const latestActiveDay = getLatestCandleBefore(dailySnapshot.nodes, to)
    if (!latestActiveDay) return []

    const from = latestActiveDay.timestamp
    const minuteTo = Math.min(to, from + ONE_DAY_SECONDS)
    const minuteSnapshot = await fetchCandleSnapshot({
      resolution: '1' as ResolutionString,
      from,
      to: minuteTo,
    })

    return getSnapshotBars({
      snapshot: minuteSnapshot,
      resolution: '1' as ResolutionString,
      priceMultiplier,
      from,
      to: minuteTo,
    })
  }

  return {
    onReady(callback) {
      setTimeout(() => callback(CONFIGURATION))
    },

    searchSymbols(_userInput, _exchange, _symbolType, onResult) {
      onResult([])
    },

    resolveSymbol(symbolName, onResolve) {
      const chartMode = getChartMode(symbolName)
      const name =
        chartMode === 'market-cap'
          ? `${symbol} / USD (Market Cap)`
          : `${symbol} / USD`
      const symbolInfo: LibrarySymbolInfo = {
        ticker: symbolName,
        name,
        description: name,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Sushi Launchpad',
        listed_exchange: 'Sushi Launchpad',
        minmov: 1,
        pricescale: getPricescale(chartMode),
        has_intraday: true,
        has_daily: true,
        has_empty_bars: false,
        supported_resolutions: SUPPORTED_RESOLUTIONS,
        volume_precision: 2,
        data_status: 'streaming',
        format: chartMode === 'market-cap' ? 'volume' : 'price',
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
        const chartMode = getChartMode(_symbolInfo.ticker ?? _symbolInfo.name)
        const priceMultiplier = getPriceMultiplier(chartMode)
        const { seconds } = getResolutionConfig(resolution)
        const currentTime = getUnixTime(new Date())
        const requestedTo = Math.min(to, currentTime)
        const requestedFrom = getCandleRequestFrom(
          Math.min(from, requestedTo - seconds * countBack),
          requestedTo,
          seconds,
        )

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
        // TradingView asks for progressively older ranges when a response does
        // not contain `countBack` bars. Launchpad candles omit empty buckets,
        // so sparse tokens can otherwise trigger a long serial request
        // waterfall. Expand once to the largest backend-supported window and
        // return the extra history in the same response.
        const expandedFrom = getCandleRequestFrom(
          requestedTo - seconds * MAX_CANDLES_PER_REQUEST,
          requestedTo,
          seconds,
        )
        const snapshotBars = getBarsInRange(
          snapshot.nodes,
          priceMultiplier,
          requestedFrom,
          requestedTo,
        )
        let bars: Bar[]
        if (
          !canUseCachedSnapshot &&
          snapshotBars.length < countBack &&
          requestedFrom > expandedFrom
        ) {
          const expandedSnapshot = await fetchCandleSnapshot({
            resolution,
            from: expandedFrom,
            to: requestedTo,
          })
          bars = await getSnapshotBars({
            snapshot: expandedSnapshot,
            resolution,
            priceMultiplier,
            from: expandedFrom,
            to: requestedTo,
          })
        } else {
          bars = await getSnapshotBars({
            snapshot,
            resolution,
            priceMultiplier,
            from: requestedFrom,
            to: requestedTo,
          })
        }

        if (resolution === '1' && bars.length === 0) {
          bars = await getLatestOneMinuteBars({
            priceMultiplier,
            to: requestedTo,
          })
        }

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
      const chartMode = getChartMode(_symbolInfo.ticker ?? _symbolInfo.name)
      const { seconds, streamInterval } = getResolutionConfig(resolution)
      subscriptions.get(listenerGuid)?.unsubscribe()
      subscriptions.set(listenerGuid, {
        unsubscribe: subscribeToLaunchpadCandleStream(streamIdentity, {
          onUpdate(update) {
            if (update.interval !== streamInterval) return
            if (update.candle.tradeCount <= 0 || update.candle.volumeUsd <= 0) {
              return
            }

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
            onTick(
              toBar(
                update.candle,
                getPriceMultiplier(chartMode),
                getPreviousClose(
                  state?.snapshot.nodes ?? [],
                  update.candle.timestamp,
                ),
              ),
            )
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
