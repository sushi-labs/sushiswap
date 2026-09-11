import type { LaunchpadCandleSnapshot } from '@sushiswap/graph-client/data-api'
import type {
  Bar,
  LibrarySymbolInfo,
  ResolutionString,
} from 'public/trading-view/charting_library/charting_library'
import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getLaunchpadCandles: vi.fn(),
}))

vi.mock('@sushiswap/graph-client/data-api', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@sushiswap/graph-client/data-api')
  >()),
  getLaunchpadCandles: mocks.getLaunchpadCandles,
}))

import {
  publishLaunchpadCandleRemove,
  publishLaunchpadCandleUpdate,
  refetchLaunchpadCandleSnapshotsWithRetry,
} from '../_lib/launchpad-stream'
import { createLaunchpadDatafeed, getLaunchpadChartSymbol } from './datafeed'

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'
const RESOLUTION = '60' as ResolutionString
const FIVE_MINUTE_RESOLUTION = '5' as ResolutionString
const ONE_MINUTE_RESOLUTION = '1' as ResolutionString
const MARKET_CAP_MULTIPLIER = 1_000
const PRICESCALES = {
  'market-cap': 100,
  price: 10_000,
}
const DATAFEED_OPTIONS = {
  chainId: CHAIN_ID,
  createdAt: '2020-01-01T00:00:00.000Z',
  getPriceMultiplier: (chartMode: 'market-cap' | 'price') =>
    chartMode === 'market-cap' ? MARKET_CAP_MULTIPLIER : 1,
  getPricescale: (chartMode: 'market-cap' | 'price') => PRICESCALES[chartMode],
  tokenAddress: TOKEN_ADDRESS,
  symbol: 'TEST',
} as const
const PRICE_SYMBOL = getLaunchpadChartSymbol(TOKEN_ADDRESS, 'TEST', 'price')
const MARKET_CAP_SYMBOL = getLaunchpadChartSymbol(
  TOKEN_ADDRESS,
  'TEST',
  'market-cap',
)
const SYMBOL_INFO = { ticker: PRICE_SYMBOL } as LibrarySymbolInfo
const MARKET_CAP_SYMBOL_INFO = {
  ticker: MARKET_CAP_SYMBOL,
} as LibrarySymbolInfo

function createSnapshot(
  streamCursor: string,
  timestamp: number,
): LaunchpadCandleSnapshot {
  return {
    streamCursor,
    nodes: [
      {
        timestamp,
        open: 1,
        high: 2,
        low: 0.5,
        close: 1.5,
        volumeUsd: 100,
        tradeCount: 2,
      },
    ],
  }
}

describe('launchpad TradingView datafeed', () => {
  it('reuses the in-flight initial candle prefetch', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const from = to - 300 * 5 * 60
    let resolveSnapshot: (snapshot: LaunchpadCandleSnapshot) => void = () =>
      undefined
    const snapshotPromise = new Promise<LaunchpadCandleSnapshot>((resolve) => {
      resolveSnapshot = resolve
    })
    mocks.getLaunchpadCandles.mockReset().mockReturnValue(snapshotPromise)
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)

    const prefetch = datafeed.prefetchInitialSnapshot()
    const barsPromise = new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        FIVE_MINUTE_RESOLUTION,
        { from, to, countBack: 329, firstDataRequest: true },
        resolve,
        reject,
      )
    })

    expect(mocks.getLaunchpadCandles).toHaveBeenCalledOnce()
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledWith({
      input: expect.objectContaining({
        countBack: 400,
        interval: 'FIVE_MINUTES',
      }),
    })

    resolveSnapshot(createSnapshot('40', to - 60))
    await prefetch
    expect(await barsPromise).toHaveLength(1)
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledOnce()
  })

  it('caps and aligns candle requests to 2,000 buckets', async () => {
    const to = 1_785_841_500
    const from = to - 600_307
    mocks.getLaunchpadCandles.mockReset().mockResolvedValue({
      streamCursor: '40',
      nodes: [],
    })
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)

    await new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        FIVE_MINUTE_RESOLUTION,
        { from, to, countBack: 2_001, firstDataRequest: true },
        resolve,
        reject,
      )
    })

    expect(mocks.getLaunchpadCandles).toHaveBeenCalledOnce()
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledWith({
      input: expect.objectContaining({
        countBack: 2_000,
        interval: 'FIVE_MINUTES',
        from: 1_785_241_500,
        to,
      }),
    })
  })

  it('requests sparse history backfill in one query', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const from = to - 300 * 5 * 60
    const olderCandle = createSnapshot('40', to - 1_500 * 5 * 60).nodes[0]!
    const recentCandle = {
      ...olderCandle,
      timestamp: to - 60,
    }
    mocks.getLaunchpadCandles.mockReset().mockResolvedValue({
      streamCursor: '40',
      nodes: [olderCandle, recentCandle],
    })
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)

    const bars = await new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        FIVE_MINUTE_RESOLUTION,
        { from, to, countBack: 300, firstDataRequest: true },
        resolve,
        reject,
      )
    })

    expect(bars).toHaveLength(2)
    expect(bars[0]?.time).toBe(olderCandle.timestamp * 1_000)
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledOnce()
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledWith({
      input: expect.objectContaining({
        countBack: 300,
        interval: 'FIVE_MINUTES',
        from: Math.floor(from / (5 * 60)) * (5 * 60),
        to,
      }),
    })
  })

  it('stops candle history at the token creation bucket', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const launchTimestamp = to - 4 * 60 * 60
    const launchBucket = Math.floor(launchTimestamp / (5 * 60)) * (5 * 60)
    const firstCandle = createSnapshot('40', launchBucket).nodes[0]!
    mocks.getLaunchpadCandles.mockReset().mockResolvedValue({
      streamCursor: '40',
      nodes: [firstCandle],
    })
    const datafeed = createLaunchpadDatafeed({
      ...DATAFEED_OPTIONS,
      createdAt: new Date(launchTimestamp * 1_000).toISOString(),
    })

    const bars = await new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        FIVE_MINUTE_RESOLUTION,
        {
          from: to - 24 * 60 * 60,
          to,
          countBack: 300,
          firstDataRequest: true,
        },
        resolve,
        reject,
      )
    })
    const prelaunchResult = await new Promise<{
      bars: Bar[]
      noData: boolean | undefined
    }>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        FIVE_MINUTE_RESOLUTION,
        {
          from: launchBucket - 24 * 60 * 60,
          to: launchBucket,
          countBack: 300,
          firstDataRequest: false,
        },
        (result, metadata) =>
          resolve({ bars: result, noData: metadata?.noData }),
        reject,
      )
    })

    expect(bars).toHaveLength(1)
    expect(prelaunchResult).toEqual({ bars: [], noData: true })
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledOnce()
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledWith({
      input: expect.objectContaining({
        countBack: 300,
        interval: 'FIVE_MINUTES',
        from: launchBucket,
        to,
      }),
    })
  })

  it('does not synthesize candles for no-trade intervals', async () => {
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)
    const symbolInfo = await new Promise<LibrarySymbolInfo>((resolve) => {
      datafeed.resolveSymbol(MARKET_CAP_SYMBOL, resolve, vi.fn())
    })

    expect(symbolInfo.has_empty_bars).toBe(false)
    expect(symbolInfo).toMatchObject({
      format: 'volume',
      name: 'TEST / USD (Market Cap)',
      pricescale: PRICESCALES['market-cap'],
    })
  })

  it('skips zero-volume candles and transforms price and market cap', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const from = to - 3 * 60 * 60
    const firstCandle = createSnapshot('40', from + 60 * 60).nodes[0]!
    const zeroVolumeCandle = {
      ...firstCandle,
      timestamp: from + 90 * 60,
      open: 3,
      high: 3,
      low: 3,
      close: 3,
      volumeUsd: 0,
      tradeCount: 1,
    }
    const secondCandle = {
      ...firstCandle,
      timestamp: from + 2 * 60 * 60,
      open: 4,
      high: 5,
      low: 4,
      close: 4.5,
      tradeCount: 1,
    }
    mocks.getLaunchpadCandles.mockReset().mockResolvedValue({
      streamCursor: '40',
      nodes: [firstCandle, zeroVolumeCandle, secondCandle],
    })
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)

    async function getBars(symbolInfo: LibrarySymbolInfo): Promise<Bar[]> {
      return new Promise((resolve, reject) => {
        datafeed.getBars(
          symbolInfo,
          RESOLUTION,
          { from, to, countBack: 3, firstDataRequest: true },
          (result) => resolve(result),
          reject,
        )
      })
    }

    const bars = await getBars(SYMBOL_INFO)
    const marketCapBars = await getBars(MARKET_CAP_SYMBOL_INFO)

    expect(bars).toHaveLength(2)
    expect(bars[1]).toMatchObject({
      open: firstCandle.close,
      high: 5,
      low: firstCandle.close,
      close: secondCandle.close,
      volume: secondCandle.volumeUsd,
    })
    expect(marketCapBars).toHaveLength(2)
    expect(marketCapBars[1]).toMatchObject({
      open: firstCandle.close * MARKET_CAP_MULTIPLIER,
      high: 5 * MARKET_CAP_MULTIPLIER,
      low: firstCandle.close * MARKET_CAP_MULTIPLIER,
      close: secondCandle.close * MARKET_CAP_MULTIPLIER,
      volume: secondCandle.volumeUsd,
    })
  })

  it('connects the first one-minute bar to the preceding candle', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const from = to - 5 * 60
    const currentCandle = {
      ...createSnapshot('42', to - 60).nodes[0]!,
      open: 4,
      high: 5,
      low: 4,
      close: 4.5,
    }
    const previousCandle = {
      ...currentCandle,
      timestamp: currentCandle.timestamp - 12 * 60 * 60,
      close: 3,
    }
    mocks.getLaunchpadCandles
      .mockReset()
      .mockResolvedValueOnce({
        streamCursor: '42',
        nodes: [previousCandle, currentCandle],
      })
      .mockResolvedValueOnce({
        streamCursor: '42',
        nodes: [],
      })
    const datafeed = createLaunchpadDatafeed(DATAFEED_OPTIONS)

    const bars = await new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        ONE_MINUTE_RESOLUTION,
        { from, to, countBack: 5, firstDataRequest: true },
        resolve,
        reject,
      )
    })

    expect(bars).toHaveLength(2)
    expect(bars[1]).toMatchObject({
      open: previousCandle.close,
      high: currentCandle.high,
      low: previousCandle.close,
      close: currentCandle.close,
    })
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledTimes(2)
    expect(mocks.getLaunchpadCandles).toHaveBeenNthCalledWith(1, {
      input: expect.objectContaining({
        countBack: 5,
        interval: 'ONE_MINUTE',
      }),
    })
    expect(mocks.getLaunchpadCandles).toHaveBeenNthCalledWith(2, {
      input: expect.objectContaining({
        countBack: 1,
        from: Math.floor((previousCandle.timestamp - 60) / 60) * 60,
        to: previousCandle.timestamp,
      }),
    })
  })

  it('filters candle intervals, removes locally, and uses fresh snapshots only for resets', async () => {
    const to = Math.floor(Date.now() / 1_000)
    const from = to - 10 * 60 * 60
    const historicalTo = from
    const historicalFrom = historicalTo - 10 * 60 * 60
    const initialSnapshot = createSnapshot('40', to - 60 * 60)
    const historicalSnapshot = createSnapshot('41', historicalTo - 60 * 60)
    const resetSnapshot = createSnapshot('50', to - 60 * 60)
    mocks.getLaunchpadCandles
      .mockReset()
      .mockResolvedValueOnce(initialSnapshot)
      .mockResolvedValueOnce(historicalSnapshot)
      .mockRejectedValueOnce(new Error('fresh snapshot unavailable'))
      .mockResolvedValueOnce(resetSnapshot)
    const onResetData = vi.fn()
    const datafeed = createLaunchpadDatafeed({
      ...DATAFEED_OPTIONS,
      onResetData,
    })

    async function getBars(
      range: { from: number; to: number } = { from, to },
    ): Promise<Bar[]> {
      return new Promise((resolve, reject) => {
        datafeed.getBars(
          SYMBOL_INFO,
          RESOLUTION,
          { ...range, countBack: 1, firstDataRequest: true },
          (bars) => resolve(bars),
          reject,
        )
      })
    }

    expect(await getBars()).toHaveLength(1)
    expect(mocks.getLaunchpadCandles).toHaveBeenLastCalledWith({
      input: expect.not.objectContaining({ fresh: expect.anything() }),
    })
    expect(
      await getBars({ from: historicalFrom, to: historicalTo }),
    ).toHaveLength(1)
    const onTick = vi.fn()
    const onReset = vi.fn()
    datafeed.subscribeBars(
      SYMBOL_INFO,
      RESOLUTION,
      onTick,
      'launchpad-candles',
      onReset,
    )

    publishLaunchpadCandleUpdate(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      {
        eventId: '41',
        interval: '1m',
        candle: { ...initialSnapshot.nodes[0]!, close: 2 },
      },
    )
    publishLaunchpadCandleUpdate(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      {
        eventId: '42',
        interval: '1h',
        candle: { ...initialSnapshot.nodes[0]!, close: 3 },
      },
    )
    expect(onTick).toHaveBeenCalledOnce()

    publishLaunchpadCandleRemove(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      {
        eventId: '43',
        interval: '1m',
        timestamp: initialSnapshot.nodes[0]!.timestamp,
      },
    )
    expect(onReset).not.toHaveBeenCalled()
    publishLaunchpadCandleRemove(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      {
        eventId: '44',
        interval: '1h',
        timestamp: initialSnapshot.nodes[0]!.timestamp,
      },
    )
    expect(onReset).toHaveBeenCalledOnce()
    expect(await getBars()).toEqual([])
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledTimes(2)

    const resetResult = await refetchLaunchpadCandleSnapshotsWithRetry(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      true,
      { attempts: 2, retryDelayMs: 0 },
    )
    expect(resetResult.streamCursor).toBe('50')
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledTimes(4)
    expect(mocks.getLaunchpadCandles).toHaveBeenLastCalledWith({
      input: expect.objectContaining({
        countBack: 1,
        fresh: true,
        from: Math.floor(from / (60 * 60)) * (60 * 60),
        to,
      }),
    })
    expect(onReset).toHaveBeenCalledTimes(2)
    expect(onResetData).toHaveBeenCalledOnce()

    datafeed.unsubscribeBars('launchpad-candles')
  })
})
