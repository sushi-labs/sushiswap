import type {
  LaunchpadMarketStats,
  LaunchpadMarketStatsWindow,
} from '@sushiswap/graph-client/data-api'
import { describe, expect, it } from 'vitest'
import {
  type LaunchpadMarketStatsTradeEvent,
  appendLaunchpadMarketStatsTradeEvent,
  foldLaunchpadMarketStats,
  getLaunchpadMarketActivity,
  isLiveLaunchpadMarketStatsWindow,
} from './launchpad-market-stats'

const LIVE_AS_OF = '2026-08-20T21:15:49.754Z'
const HELD_AS_OF = '2026-08-20T21:10:49.748Z'

function window(
  overrides: Partial<LaunchpadMarketStatsWindow> = {},
): LaunchpadMarketStatsWindow {
  return {
    asOf: LIVE_AS_OF,
    buyCount: 2,
    buyVolumeUsd: 200,
    priceBaselineUsd: 1,
    priceChangePercent: 0,
    sellCount: 1,
    sellVolumeUsd: 100,
    totalTradeCount: 3,
    totalVolumeUsd: 300,
    ...overrides,
  }
}

function stats(
  overrides: Partial<LaunchpadMarketStats> = {},
): LaunchpadMarketStats {
  return {
    asOf: LIVE_AS_OF,
    h1: window(),
    h24: window({ asOf: HELD_AS_OF, priceBaselineUsd: 0.5 }),
    h6: window({ asOf: HELD_AS_OF, priceBaselineUsd: 0.8 }),
    m5: window(),
    priceUsd: 1,
    streamCursor: '100',
    ...overrides,
  }
}

function tradeEvent(
  overrides: Partial<LaunchpadMarketStatsTradeEvent> = {},
): LaunchpadMarketStatsTradeEvent {
  return {
    amountUsd: 50,
    direction: 'BUY',
    eventId: '101',
    isNew: true,
    marginalPriceUsd: null,
    timestamp: LIVE_AS_OF,
    tradeKey: 'trade-1',
    ...overrides,
  }
}

describe('isLiveLaunchpadMarketStatsWindow', () => {
  it('treats the windows sharing the response bound as foldable', () => {
    const snapshot = stats()

    expect(isLiveLaunchpadMarketStatsWindow(snapshot, 'm5')).toBe(true)
    expect(isLiveLaunchpadMarketStatsWindow(snapshot, 'h1')).toBe(true)
    expect(isLiveLaunchpadMarketStatsWindow(snapshot, 'h6')).toBe(false)
    expect(isLiveLaunchpadMarketStatsWindow(snapshot, 'h24')).toBe(false)
  })
})

describe('appendLaunchpadMarketStatsTradeEvent', () => {
  it('orders distinct trades numerically', () => {
    const events = [
      tradeEvent({ eventId: '9' }),
      tradeEvent({ eventId: '10', tradeKey: 'trade-2' }),
    ].reduce<readonly LaunchpadMarketStatsTradeEvent[]>(
      appendLaunchpadMarketStatsTradeEvent,
      [],
    )

    expect(events).toEqual([
      tradeEvent({ eventId: '9' }),
      tradeEvent({ eventId: '10', tradeKey: 'trade-2' }),
    ])
  })

  it('replaces an updated trade without turning it into another trade', () => {
    const events = appendLaunchpadMarketStatsTradeEvent(
      [tradeEvent()],
      tradeEvent({
        amountUsd: 75,
        eventId: '102',
        isNew: false,
      }),
    )

    expect(events).toEqual([
      tradeEvent({ amountUsd: 75, eventId: '102', isNew: true }),
    ])
  })
})

describe('foldLaunchpadMarketStats', () => {
  it('keeps the snapshot untouched when no event applies', () => {
    const snapshot = stats()

    expect(foldLaunchpadMarketStats(snapshot, [])).toBe(snapshot)
    expect(
      foldLaunchpadMarketStats(snapshot, [tradeEvent({ eventId: '100' })]),
    ).toBe(snapshot)
  })

  it('folds a new trade into the live windows only', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ amountUsd: 50, direction: 'BUY' }),
      tradeEvent({
        amountUsd: 20,
        direction: 'SELL',
        eventId: '102',
        tradeKey: 'trade-2',
      }),
    ])

    expect(folded.m5).toMatchObject({
      buyCount: 3,
      buyVolumeUsd: 250,
      sellCount: 2,
      sellVolumeUsd: 120,
      totalTradeCount: 5,
      totalVolumeUsd: 370,
    })
    expect(folded.h1).toMatchObject(folded.m5)
    expect(folded.h6).toMatchObject({
      buyCount: 2,
      totalTradeCount: 3,
      totalVolumeUsd: 300,
    })
    expect(folded.h24).toMatchObject({
      buyCount: 2,
      totalTradeCount: 3,
      totalVolumeUsd: 300,
    })
  })

  it('counts a trade whose usd value is unknown without moving volume', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ amountUsd: null }),
    ])

    expect(folded.m5).toMatchObject({
      buyCount: 3,
      buyVolumeUsd: 200,
      totalTradeCount: 4,
      totalVolumeUsd: 300,
    })
  })

  it('ignores an update to a trade the snapshot already counted', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ isNew: false }),
    ])

    expect(folded.m5.totalTradeCount).toBe(3)
    expect(folded.m5.totalVolumeUsd).toBe(300)
  })

  it('folds a newly indexed trade whose block timestamp predates the snapshot', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ timestamp: '2026-08-20T21:15:40.000Z' }),
    ])

    expect(folded.m5.totalTradeCount).toBe(4)
    expect(folded.m5.totalVolumeUsd).toBe(350)
  })

  it('does not fold a new trade into a window it has already aged out of', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ timestamp: '2026-08-20T21:10:00.000Z' }),
    ])

    expect(folded.m5.totalTradeCount).toBe(3)
    expect(folded.h1.totalTradeCount).toBe(4)
  })

  it('replays price change against every window baseline', () => {
    const folded = foldLaunchpadMarketStats(stats(), [
      tradeEvent({ marginalPriceUsd: 2 }),
      tradeEvent({
        eventId: '102',
        marginalPriceUsd: null,
        tradeKey: 'trade-2',
      }),
    ])

    expect(folded.priceUsd).toBe(2)
    expect(folded.m5.priceChangePercent).toBe(100)
    expect(folded.h6.priceChangePercent).toBeCloseTo(150)
    expect(folded.h24.priceChangePercent).toBe(300)
  })

  it('leaves price change alone when no folded trade carried a price', () => {
    const folded = foldLaunchpadMarketStats(
      stats({ priceUsd: null, m5: window({ priceChangePercent: null }) }),
      [tradeEvent()],
    )

    expect(folded.priceUsd).toBeNull()
    expect(folded.m5.priceChangePercent).toBeNull()
  })
})

describe('getLaunchpadMarketActivity', () => {
  it('splits pressure by volume', () => {
    expect(
      getLaunchpadMarketActivity(
        window({
          buyCount: 12,
          buyVolumeUsd: 600,
          priceChangePercent: -6.69,
          sellCount: 3,
          sellVolumeUsd: 1400,
          totalTradeCount: 15,
          totalVolumeUsd: 2000,
        }),
      ),
    ).toEqual({
      buyCount: 12,
      buySharePercent: 30,
      buyVolumeUsd: 600,
      netFlowUsd: -800,
      priceChangePercent: -6.69,
      sellCount: 3,
      sellSharePercent: 70,
      sellVolumeUsd: 1400,
      shareBasis: 'volume',
      totalTradeCount: 15,
      totalVolumeUsd: 2000,
    })
  })

  it('falls back to trade counts when a window has no priced volume', () => {
    const activity = getLaunchpadMarketActivity(
      window({
        buyCount: 1,
        buyVolumeUsd: 0,
        sellCount: 2,
        sellVolumeUsd: 0,
        totalTradeCount: 3,
        totalVolumeUsd: 0,
      }),
    )

    expect(activity.buySharePercent).toBeCloseTo(100 / 3)
    expect(activity.sellSharePercent).toBeCloseTo(200 / 3)
    expect(activity.shareBasis).toBe('trades')
  })

  it('preserves sub-percentage changes for the activity bar', () => {
    const activity = getLaunchpadMarketActivity(
      window({
        buyVolumeUsd: 600.1,
        sellVolumeUsd: 1400,
        totalVolumeUsd: 2000.1,
      }),
    )

    expect(activity.buySharePercent).toBeCloseTo(30.003499825)
    expect(activity.buySharePercent).not.toBe(30)
  })

  it('renders an empty window as an even split', () => {
    expect(
      getLaunchpadMarketActivity(
        window({
          buyCount: 0,
          buyVolumeUsd: 0,
          sellCount: 0,
          sellVolumeUsd: 0,
          totalTradeCount: 0,
          totalVolumeUsd: 0,
        }),
      ),
    ).toMatchObject({
      buySharePercent: 50,
      netFlowUsd: 0,
      sellSharePercent: 50,
      shareBasis: 'trades',
    })
  })
})
