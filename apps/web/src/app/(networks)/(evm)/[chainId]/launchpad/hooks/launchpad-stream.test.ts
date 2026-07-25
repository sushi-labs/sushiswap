import type {
  LaunchpadTrade,
  LaunchpadTradeConnection,
} from '@sushiswap/graph-client/data-api'
import { describe, expect, it, vi } from 'vitest'
import {
  applyLaunchpadCandleStreamMutations,
  applyLaunchpadTradeMutation,
  flattenLaunchpadTradePages,
  launchpadEventsUrl,
  minimumLaunchpadStreamCursor,
  publishLaunchpadCandleRemove,
  publishLaunchpadCandleUpdate,
  refetchLaunchpadCandleSnapshots,
  refetchLaunchpadCandleSnapshotsWithRetry,
  subscribeToLaunchpadCandleStream,
} from './launchpad-stream'

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'
const TRANSACTION_HASH: `0x${string}` =
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
  it('keeps the full decimal stream cursor in the EventSource URL', () => {
    const url = new URL(
      launchpadEventsUrl({
        apiBaseUrl: 'https://api.sushi.com',
        chainId: CHAIN_ID,
        tokenAddress: TOKEN_ADDRESS,
        streamCursor: '9007199254740993123456789',
      }),
    )

    expect(url.pathname).toBe('/graphql/launchpad/events')
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

  it('merges candle updates and removals after the snapshot cursor', async () => {
    const onRemove = vi.fn()
    const onReset = vi.fn().mockResolvedValue('43')
    const onUpdate = vi.fn()
    const unsubscribe = subscribeToLaunchpadCandleStream(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      { onRemove, onReset, onUpdate },
    )
    const candle = {
      timestamp: 1_753_401_600,
      open: 1,
      high: 2,
      low: 0.5,
      close: 1.5,
      volumeUsd: 100,
      tradeCount: 2,
    }

    publishLaunchpadCandleUpdate(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      { eventId: '41', interval: '1m', candle },
    )
    publishLaunchpadCandleRemove(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      { eventId: '42', interval: '1m', timestamp: candle.timestamp },
    )
    publishLaunchpadCandleUpdate(
      {
        chainId: CHAIN_ID,
        tokenAddress: '0x4444444444444444444444444444444444444444',
      },
      { eventId: '43', interval: '1m', candle },
    )
    const merged = applyLaunchpadCandleStreamMutations(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      '1m',
      { streamCursor: '40', nodes: [] },
    )
    const resetCursor = await refetchLaunchpadCandleSnapshots(
      { chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS },
      true,
    )
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
    const retryTokenAddress =
      '0x5555555555555555555555555555555555555555' as const
    const unsubscribe = subscribeToLaunchpadCandleStream(
      { chainId: CHAIN_ID, tokenAddress: retryTokenAddress },
      { onRemove: vi.fn(), onReset, onUpdate: vi.fn() },
    )

    const result = await refetchLaunchpadCandleSnapshotsWithRetry(
      { chainId: CHAIN_ID, tokenAddress: retryTokenAddress },
      true,
      { attempts: 2, retryDelayMs: 0 },
    )
    unsubscribe()

    expect(onReset).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      failedSubscriberCount: 0,
      streamCursor: '44',
      subscriberCount: 1,
    })
  })
})
