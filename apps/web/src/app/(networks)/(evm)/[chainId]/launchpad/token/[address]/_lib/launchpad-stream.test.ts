import type {
  LaunchpadTrade,
  LaunchpadTradeConnection,
} from '@sushiswap/graph-client/data-api'
import type { EvmTxHash } from 'sushi/evm'
import { describe, expect, it, vi } from 'vitest'
import {
  LaunchpadCandleController,
  type LaunchpadTradeMutation,
  applyLaunchpadTradeMutation,
  flattenLaunchpadTradePages,
  launchpadEventsUrl,
  minimumLaunchpadStreamCursor,
  reconcileLaunchpadTradeResetSnapshot,
} from './launchpad-stream'
import {
  parseLaunchpadMetricsStreamEvent,
  parseLaunchpadTradeResetStreamEvent,
  parseLaunchpadTradeStreamEvent,
} from './launchpad-stream-events'

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'
const TRANSACTION_HASH: EvmTxHash =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

function createTrade(overrides: Partial<LaunchpadTrade> = {}): LaunchpadTrade {
  return {
    id: 'trade-1',
    chainId: CHAIN_ID,
    tokenAddress: TOKEN_ADDRESS,
    poolAddress: '0x2222222222222222222222222222222222222222',
    feeTier: 10_000,
    isLaunchPool: true,
    transactionHash: TRANSACTION_HASH,
    logIndex: 1,
    blockNumber: '100',
    timestamp: '2026-07-25T00:00:00.000Z',
    trader: null,
    direction: 'BUY',
    tokenAmount: '1000000000000000000',
    quoteToken: {
      address: '0x3333333333333333333333333333333333333333',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    quoteAmount: '2000000',
    priceUsd: 2,
    amountUsd: 2,
    ...overrides,
  }
}

function createConnection(
  trade: LaunchpadTrade = createTrade(),
): LaunchpadTradeConnection {
  return {
    edges: [{ cursor: '40', node: trade }],
    pageInfo: { endCursor: null, hasNextPage: false },
    streamCursor: '40',
    totalCount: 1,
  }
}

describe('launchpad stream', () => {
  it('parses trade resets created from an empty stream payload', () => {
    const payload = parseLaunchpadTradeResetStreamEvent(
      new MessageEvent('trade.reset', {
        data: JSON.stringify({
          chainId: CHAIN_ID,
          tokenAddress: TOKEN_ADDRESS,
          eventId: '41',
        }),
      }),
    )

    expect(payload).toEqual({
      chainId: CHAIN_ID,
      tokenAddress: TOKEN_ADDRESS,
      eventId: '41',
    })
  })

  it('accepts metrics updates', () => {
    const payload = parseLaunchpadMetricsStreamEvent(
      new MessageEvent('metrics', {
        data: JSON.stringify({
          chainId: CHAIN_ID,
          tokenAddress: TOKEN_ADDRESS,
          eventId: '41',
          version: '2',
          metrics: {
            priceUsd: 1,
            marketCapitalizationUsd: 1_000_000,
            fullyDilutedValuationUsd: 1_000_000,
            currentTvlUsd: 100_000,
            volumeUsd: { h1: 1, h6: 2, h12: 3, h24: 4 },
            tvlChangePercent: { h1: null, h6: null, h12: null, h24: null },
            asOf: '2026-07-25T00:00:00.000Z',
            source: 'launchpad',
            isStale: false,
          },
        }),
      }),
    )
    expect(payload?.metrics.marketCapitalizationUsd).toBe(1_000_000)
  })

  it('preserves the marginal price from trade updates', () => {
    const payload = parseLaunchpadTradeStreamEvent(
      new MessageEvent('trade.upsert', {
        data: JSON.stringify({
          ...createTrade(),
          eventId: '41',
          isNew: true,
          marginalPriceUsd: 1.75,
        }),
      }),
    )

    expect(payload?.marginalPriceUsd).toBe(1.75)
    expect(payload?.priceUsd).toBe(2)
  })

  it('keeps the full decimal stream cursor in the EventSource URL', () => {
    const url = new URL(
      launchpadEventsUrl({
        apiBaseUrl: 'https://api.sushi.com',
        chainId: CHAIN_ID,
        tokenAddress: TOKEN_ADDRESS,
        streamCursor: '9007199254740993123456789',
      }),
    )

    expect(url.pathname).toBe('/stream/launchpad/events')
    expect(url.searchParams.get('chainId')).toBe(String(CHAIN_ID))
    expect(url.searchParams.get('tokenAddress')).toBe(TOKEN_ADDRESS)
    expect(url.searchParams.get('after')).toBe('9007199254740993123456789')
  })

  it('keeps the snapshot stream cursor separate from pagination cursors', () => {
    const firstPage = {
      ...createConnection(),
      pageInfo: { endCursor: 'page-1', hasNextPage: true },
      streamCursor: '100',
    }
    const secondPage = {
      ...createConnection(createTrade({ id: 'trade-2', logIndex: 0 })),
      pageInfo: { endCursor: 'page-2', hasNextPage: false },
      streamCursor: '200',
    }
    const flattened = flattenLaunchpadTradePages([firstPage, secondPage])

    expect(flattened.streamCursor).toBe('100')
    expect(flattened.pageInfo.endCursor).toBe('page-2')
  })

  it('selects the older decimal cursor without number conversion', () => {
    expect(
      minimumLaunchpadStreamCursor(
        '9007199254740993123456789',
        '9007199254740993123456700',
      ),
    ).toBe('9007199254740993123456700')
  })

  it('replaces duplicate trades without incrementing the total', () => {
    const correctedTrade = createTrade({
      amountUsd: 3,
      blockNumber: '101',
      priceUsd: 3,
    })
    const next = applyLaunchpadTradeMutation(
      createConnection(),
      { eventId: '41', type: 'upsert', trade: correctedTrade },
      false,
    )

    expect(next.edges).toHaveLength(1)
    expect(next.edges[0]).toEqual({ cursor: '41', node: correctedTrade })
    expect(next.totalCount).toBe(1)
  })

  it('does not recount replayed trades outside the loaded page', () => {
    const connection = {
      ...createConnection(),
      streamCursor: '50',
      totalCount: 100,
    }
    const replayed = applyLaunchpadTradeMutation(
      connection,
      {
        eventId: '49',
        type: 'upsert',
        trade: createTrade({ id: 'trade-2', logIndex: 2 }),
      },
      false,
    )
    const live = applyLaunchpadTradeMutation(
      replayed,
      {
        eventId: '51',
        type: 'upsert',
        trade: createTrade({ id: 'trade-3', logIndex: 3 }),
      },
      false,
    )

    expect(replayed.totalCount).toBe(100)
    expect(live.totalCount).toBe(101)
  })

  it('does not throw when replay comparison receives an invalid cursor', () => {
    const connection = {
      ...createConnection(),
      edges: [],
      streamCursor: 'invalid',
    }

    expect(() =>
      applyLaunchpadTradeMutation(
        connection,
        {
          eventId: '51',
          type: 'upsert',
          trade: createTrade({ id: 'trade-2', logIndex: 2 }),
        },
        false,
      ),
    ).not.toThrow()
  })

  it('only decrements the total when a removal deletes a loaded trade', () => {
    const mutation = {
      eventId: '41',
      type: 'remove' as const,
      transactionHash: TRANSACTION_HASH,
      logIndex: 1,
    }
    const removed = applyLaunchpadTradeMutation(
      createConnection(),
      mutation,
      false,
    )
    const duplicateRemoval = applyLaunchpadTradeMutation(
      removed,
      mutation,
      false,
    )

    expect(removed.edges).toEqual([])
    expect(removed.totalCount).toBe(0)
    expect(duplicateRemoval.totalCount).toBe(0)
  })

  it('reapplies the small-trade filter to corrections', () => {
    const next = applyLaunchpadTradeMutation(
      createConnection(),
      {
        eventId: '41',
        type: 'upsert',
        trade: createTrade({ amountUsd: 0.5 }),
      },
      false,
    )

    expect(next.edges).toEqual([])
    expect(next.totalCount).toBe(0)
  })

  it('accepts reset snapshots only after the boundary and reapplies newer events', () => {
    const resetEventId = '900719925474099312345678950'
    const snapshotEventId = '900719925474099312345678951'
    const newerEventId = '900719925474099312345678952'
    const snapshotTrade = createTrade({ id: 'trade-2', logIndex: 2 })
    const newerTrade = createTrade({ id: 'trade-3', logIndex: 3 })
    const bufferedMutations: LaunchpadTradeMutation[] = [
      {
        eventId: snapshotEventId,
        type: 'upsert',
        trade: snapshotTrade,
      },
      { eventId: newerEventId, type: 'upsert', trade: newerTrade },
    ]
    const emptySnapshot = {
      ...createConnection(),
      edges: [],
      totalCount: 0,
    }

    expect(
      reconcileLaunchpadTradeResetSnapshot(
        {
          ...emptySnapshot,
          streamCursor: '900719925474099312345678949',
        },
        resetEventId,
        bufferedMutations,
        false,
      ),
    ).toBeNull()

    const reconciled = reconcileLaunchpadTradeResetSnapshot(
      { ...emptySnapshot, streamCursor: snapshotEventId },
      resetEventId,
      bufferedMutations,
      false,
    )

    expect(reconciled?.mutations).toEqual([bufferedMutations[1]])
    expect(reconciled?.connection.edges).toEqual([
      { cursor: newerEventId, node: newerTrade },
    ])
    expect(reconciled?.connection.totalCount).toBe(1)
  })

  it('merges candle updates and removals after the snapshot cursor', async () => {
    const controller = new LaunchpadCandleController({
      chainId: CHAIN_ID,
      createdAt: '2026-01-01T00:00:00.000Z',
      tokenAddress: TOKEN_ADDRESS,
    })
    const onRemove = vi.fn()
    const onReset = vi.fn().mockResolvedValue('43')
    const onUpdate = vi.fn()
    const unsubscribe = controller.subscribe({ onRemove, onReset, onUpdate })
    const candle = {
      timestamp: 1_753_401_600,
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volumeUsd: 100,
      tradeCount: 2,
    }

    controller.publishUpdate({ eventId: '41', interval: '1m', candle })
    controller.publishRemove({
      eventId: '42',
      interval: '1m',
      timestamp: candle.timestamp,
    })
    const merged = controller.applyStreamMutations('1m', {
      streamCursor: '40',
      nodes: [],
    })
    const resetCursor = await controller.refetchSnapshots(true)
    unsubscribe()

    expect(onUpdate).toHaveBeenCalledOnce()
    expect(onUpdate).toHaveBeenCalledWith({
      eventId: '41',
      interval: '1m',
      candle,
    })
    expect(onRemove).toHaveBeenCalledOnce()
    expect(merged.nodes).toEqual([])
    expect(onReset).toHaveBeenCalledWith(true)
    expect(resetCursor).toBe('43')
  })

  it('retries a failed candle snapshot refresh until it returns a cursor', async () => {
    const onReset = vi
      .fn()
      .mockRejectedValueOnce(new Error('snapshot unavailable'))
      .mockResolvedValueOnce('44')
    const controller = new LaunchpadCandleController({
      chainId: CHAIN_ID,
      createdAt: '2026-01-01T00:00:00.000Z',
      tokenAddress: '0x5555555555555555555555555555555555555555',
    })
    const unsubscribe = controller.subscribe({
      onRemove: vi.fn(),
      onReset,
      onUpdate: vi.fn(),
    })

    const result = await controller.refetchSnapshotsWithRetry(true, {
      attempts: 2,
      retryDelayMs: 0,
    })
    unsubscribe()

    expect(onReset).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      failedSubscriberCount: 0,
      streamCursor: '44',
      subscriberCount: 1,
    })
  })

  it('refreshes every active candle resolution and selects the oldest cursor', async () => {
    const controller = new LaunchpadCandleController({
      chainId: CHAIN_ID,
      createdAt: '2026-01-01T00:00:00.000Z',
      tokenAddress: TOKEN_ADDRESS,
    })
    const refreshFiveMinutes = vi.fn().mockResolvedValue('80')
    const refreshOneHour = vi.fn().mockResolvedValue('90')
    controller.subscribe({
      onRemove: vi.fn(),
      onReset: refreshFiveMinutes,
      onUpdate: vi.fn(),
    })
    controller.subscribe({
      onRemove: vi.fn(),
      onReset: refreshOneHour,
      onUpdate: vi.fn(),
    })

    const result = await controller.refetchSnapshotsWithRetry(true, {
      attempts: 1,
    })

    expect(refreshFiveMinutes).toHaveBeenCalledWith(true)
    expect(refreshOneHour).toHaveBeenCalledWith(true)
    expect(result).toEqual({
      failedSubscriberCount: 0,
      streamCursor: '80',
      subscriberCount: 2,
    })
  })

  it('keeps token-scoped controllers isolated and disposes listeners', () => {
    const first = new LaunchpadCandleController({
      chainId: CHAIN_ID,
      createdAt: '2026-01-01T00:00:00.000Z',
      tokenAddress: TOKEN_ADDRESS,
    })
    const second = new LaunchpadCandleController({
      chainId: CHAIN_ID,
      createdAt: '2026-01-01T00:00:00.000Z',
      tokenAddress: '0x6666666666666666666666666666666666666666',
    })
    const firstUpdate = vi.fn()
    const secondUpdate = vi.fn()
    const unsubscribe = first.subscribe({
      onRemove: vi.fn(),
      onReset: vi.fn().mockResolvedValue('1'),
      onUpdate: firstUpdate,
    })
    second.subscribe({
      onRemove: vi.fn(),
      onReset: vi.fn().mockResolvedValue('1'),
      onUpdate: secondUpdate,
    })
    const update = {
      eventId: '101',
      interval: '1m' as const,
      candle: {
        timestamp: 1_753_401_600,
        open: 1,
        high: 2,
        low: 0.5,
        close: 1.5,
        volumeUsd: 100,
        tradeCount: 2,
      },
    }

    first.publishUpdate(update)
    unsubscribe()
    first.publishUpdate({ ...update, eventId: '102' })
    first.dispose()
    first.publishUpdate({ ...update, eventId: '103' })

    expect(firstUpdate).toHaveBeenCalledOnce()
    expect(secondUpdate).not.toHaveBeenCalled()
  })
})
