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
} from '../../../hooks/launchpad-stream'
import { createLaunchpadDatafeed } from './datafeed'

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'
const RESOLUTION = '60' as ResolutionString
const SYMBOL_INFO = {} as LibrarySymbolInfo

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
  it('does not synthesize candles for no-trade intervals', async () => {
    const datafeed = createLaunchpadDatafeed({
      chainId: CHAIN_ID,
      tokenAddress: TOKEN_ADDRESS,
      symbol: 'TEST',
      pricescale: 100,
    })
    const symbolInfo = await new Promise<LibrarySymbolInfo>((resolve) => {
      datafeed.resolveSymbol('TEST', resolve, vi.fn())
    })

    expect(symbolInfo.has_empty_bars).toBe(false)
  })

  it('skips zero-volume candles and connects traded candles', async () => {
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
    mocks.getLaunchpadCandles.mockReset().mockResolvedValueOnce({
      streamCursor: '40',
      nodes: [firstCandle, zeroVolumeCandle, secondCandle],
    })
    const datafeed = createLaunchpadDatafeed({
      chainId: CHAIN_ID,
      tokenAddress: TOKEN_ADDRESS,
      symbol: 'TEST',
      pricescale: 100,
    })

    const bars = await new Promise<Bar[]>((resolve, reject) => {
      datafeed.getBars(
        SYMBOL_INFO,
        RESOLUTION,
        { from, to, countBack: 3, firstDataRequest: true },
        (result) => resolve(result),
        reject,
      )
    })

    expect(bars).toHaveLength(2)
    expect(bars[1]).toMatchObject({
      open: firstCandle.close,
      high: 5,
      low: firstCandle.close,
      close: secondCandle.close,
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
      chainId: CHAIN_ID,
      onResetData,
      tokenAddress: TOKEN_ADDRESS,
      symbol: 'TEST',
      pricescale: 100,
    })

    async function getBars(
      range: { from: number; to: number } = { from, to },
    ): Promise<Bar[]> {
      return new Promise((resolve, reject) => {
        datafeed.getBars(
          SYMBOL_INFO,
          RESOLUTION,
          { ...range, countBack: 10, firstDataRequest: true },
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
      input: expect.objectContaining({ fresh: true, from, to }),
    })
    expect(onReset).toHaveBeenCalledTimes(2)
    expect(onResetData).toHaveBeenCalledOnce()

    datafeed.unsubscribeBars('launchpad-candles')
  })
})
