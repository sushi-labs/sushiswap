import type {
  LaunchpadMarketStats,
  LaunchpadMarketStatsWindow,
} from '@sushiswap/graph-client/data-api'
import ms from 'ms'
import type { LaunchpadTradeStreamEvent } from './launchpad-stream'

export type LaunchpadMarketStatsWindowKey = 'm5' | 'h1' | 'h6' | 'h24'

export const LAUNCHPAD_MARKET_STATS_WINDOWS = [
  { key: 'm5', label: '5m', name: '5 minute' },
  { key: 'h1', label: '1h', name: '1 hour' },
  { key: 'h6', label: '6h', name: '6 hour' },
  { key: 'h24', label: '24h', name: '24 hour' },
] as const satisfies readonly {
  key: LaunchpadMarketStatsWindowKey
  label: string
  name: string
}[]

export const DEFAULT_LAUNCHPAD_MARKET_STATS_WINDOW = 'h1' as const

/**
 * The two short windows are recomputed on every poll; the two long ones are
 * held in a server cache for minutes at a time. The tier is not hardcoded here
 * because the response states it: a window refreshed alongside the stream
 * cursor carries the same `asOf` as the response itself.
 */
export function isLiveLaunchpadMarketStatsWindow(
  stats: LaunchpadMarketStats,
  key: LaunchpadMarketStatsWindowKey,
): boolean {
  return stats[key].asOf === stats.asOf
}

export interface LaunchpadMarketStatsTradeEvent {
  amountUsd: number | null
  direction: 'BUY' | 'SELL'
  eventId: string
  insertionEventId: string | null
  marginalPriceUsd: number | null
  timestamp: string
  tradeKey: string
}

const FOLDED_TRADE_EVENT_LIMIT = 200

export function appendLaunchpadMarketStatsTradeEvent(
  events: readonly LaunchpadMarketStatsTradeEvent[],
  event: LaunchpadTradeStreamEvent,
): readonly LaunchpadMarketStatsTradeEvent[] {
  const previous = events.find(
    (candidate) => candidate.tradeKey === event.tradeKey,
  )
  const next = events.filter(
    (candidate) => candidate.tradeKey !== event.tradeKey,
  )
  const { isNew, ...tradeEvent } = event
  next.push({
    ...tradeEvent,
    insertionEventId: isNew
      ? event.eventId
      : (previous?.insertionEventId ?? null),
  })
  next.sort((left, right) =>
    BigInt(left.eventId) < BigInt(right.eventId) ? -1 : 1,
  )
  return next.slice(-FOLDED_TRADE_EVENT_LIMIT)
}

const WINDOW_DURATION_MS: Record<LaunchpadMarketStatsWindowKey, number> = {
  m5: ms('5m'),
  h1: ms('1h'),
  h6: ms('6h'),
  h24: ms('24h'),
}

function isTradeInWindow(
  event: LaunchpadMarketStatsTradeEvent,
  window: LaunchpadMarketStatsWindow,
  key: LaunchpadMarketStatsWindowKey,
): boolean {
  const timestamp = Date.parse(event.timestamp)
  const asOf = Date.parse(window.asOf)
  return (
    Number.isFinite(timestamp) &&
    Number.isFinite(asOf) &&
    timestamp >= asOf - WINDOW_DURATION_MS[key]
  )
}

function foldWindow(
  window: LaunchpadMarketStatsWindow,
  events: readonly LaunchpadMarketStatsTradeEvent[],
): LaunchpadMarketStatsWindow {
  let buyCount = window.buyCount
  let buyVolumeUsd = window.buyVolumeUsd
  let sellCount = window.sellCount
  let sellVolumeUsd = window.sellVolumeUsd

  for (const event of events) {
    if (event.direction === 'BUY') {
      buyCount += 1
      buyVolumeUsd += event.amountUsd ?? 0
    } else {
      sellCount += 1
      sellVolumeUsd += event.amountUsd ?? 0
    }
  }

  return {
    ...window,
    buyCount,
    buyVolumeUsd,
    sellCount,
    sellVolumeUsd,
    totalTradeCount: buyCount + sellCount,
    totalVolumeUsd: buyVolumeUsd + sellVolumeUsd,
  }
}

function repriceWindow(
  window: LaunchpadMarketStatsWindow,
  priceUsd: number,
): LaunchpadMarketStatsWindow {
  if (!window.priceBaselineUsd) return window

  return {
    ...window,
    priceChangePercent: (priceUsd / window.priceBaselineUsd - 1) * 100,
  }
}

/**
 * Replays stream events the snapshot has not seen yet, so the short windows
 * stay responsive between polls.
 *
 * Volume and counts are only folded into the windows that share the response's
 * `asOf`: for those, the cursor tells us exactly what is already counted, and
 * trade identity tells us whether an event is an insertion or a correction,
 * so newly indexed trades can be folded even when their block timestamp is a
 * little older than the snapshot bound. One trade is a rounding error over 6
 * or 24 hours, so the held windows are left for the next poll to refresh.
 *
 * Price change is replayed for every window, held ones included, because the
 * server computes it the same way — each window's cached baseline against the
 * latest price, not a stored percentage.
 *
 * Folded totals still drift: a rolling window sheds trades that age out, and a
 * removal carries no amount to subtract. Neither error accumulates, both are
 * bounded by the poll interval, and the poll is what makes this safe.
 */
export function foldLaunchpadMarketStats(
  stats: LaunchpadMarketStats,
  events: readonly LaunchpadMarketStatsTradeEvent[],
): LaunchpadMarketStats {
  const streamCursor = BigInt(stats.streamCursor)
  const pending = events.filter(
    (event) =>
      event.insertionEventId !== null &&
      BigInt(event.insertionEventId) > streamCursor,
  )
  if (pending.length === 0) return stats

  const latestPriceUsd =
    pending.reduce<number | null>(
      (latest, event) => event.marginalPriceUsd ?? latest,
      null,
    ) ?? stats.priceUsd
  const fold = (key: LaunchpadMarketStatsWindowKey) => {
    const window = isLiveLaunchpadMarketStatsWindow(stats, key)
      ? foldWindow(
          stats[key],
          pending.filter((event) => isTradeInWindow(event, stats[key], key)),
        )
      : stats[key]
    return latestPriceUsd === null
      ? window
      : repriceWindow(window, latestPriceUsd)
  }

  return {
    ...stats,
    priceUsd: latestPriceUsd,
    m5: fold('m5'),
    h1: fold('h1'),
    h6: fold('h6'),
    h24: fold('h24'),
  }
}

export interface LaunchpadMarketActivity {
  buyCount: number
  buySharePercent: number
  buyVolumeUsd: number
  netFlowUsd: number
  priceChangePercent: number | null
  sellCount: number
  sellSharePercent: number
  sellVolumeUsd: number
  shareBasis: 'trades' | 'volume'
  totalTradeCount: number
  totalVolumeUsd: number
}

/**
 * Splits a window into the numbers the activity card renders. Pressure is
 * measured by volume, falling back to trade counts for a window whose trades
 * all went unpriced — otherwise a busy window would render as an even split.
 */
export function getLaunchpadMarketActivity(
  window: LaunchpadMarketStatsWindow,
): LaunchpadMarketActivity {
  const shareBasis = window.totalVolumeUsd > 0 ? 'volume' : 'trades'
  const buyShare =
    shareBasis === 'volume'
      ? window.buyVolumeUsd / window.totalVolumeUsd
      : window.totalTradeCount > 0
        ? window.buyCount / window.totalTradeCount
        : 0.5
  const buySharePercent = buyShare * 100

  return {
    buyCount: window.buyCount,
    buySharePercent,
    buyVolumeUsd: window.buyVolumeUsd,
    netFlowUsd: window.buyVolumeUsd - window.sellVolumeUsd,
    priceChangePercent: window.priceChangePercent,
    sellCount: window.sellCount,
    sellSharePercent: 100 - buySharePercent,
    sellVolumeUsd: window.sellVolumeUsd,
    shareBasis,
    totalTradeCount: window.totalTradeCount,
    totalVolumeUsd: window.totalVolumeUsd,
  }
}
