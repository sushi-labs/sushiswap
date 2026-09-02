/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, StrictMode, act, createElement } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { EvmAddress } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getLaunchpadCandles: vi.fn(),
  getLaunchpadMarketStats: vi.fn(),
  getLaunchpadTrades: vi.fn(),
}))

vi.mock('@sushiswap/graph-client/data-api', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@sushiswap/graph-client/data-api')
  >()),
  getLaunchpadCandles: mocks.getLaunchpadCandles,
  getLaunchpadMarketStats: mocks.getLaunchpadMarketStats,
  getLaunchpadTrades: mocks.getLaunchpadTrades,
}))

import {
  LaunchpadLiveDataProvider,
  useLaunchpadCandleController,
  useLaunchpadLiveMarketStats,
  useLaunchpadLiveTrades,
} from './launchpad-live-data-provider'

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111' as EvmAddress
const OTHER_TOKEN_ADDRESS =
  '0x2222222222222222222222222222222222222222' as EvmAddress
const TRANSACTION_HASH =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const CREATED_AT = '2026-01-01T00:00:00.000Z'

class FakeEventSource {
  static readonly CLOSED = 2
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly instances: FakeEventSource[] = []

  readonly listeners = new Map<string, Set<(event: Event) => void>>()
  readonly url: string
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onopen: ((event: Event) => void) | null = null
  readyState = FakeEventSource.CONNECTING
  withCredentials = false

  constructor(url: string | URL) {
    this.url = String(url)
    FakeEventSource.instances.push(this)
  }

  addEventListener(type: string, listener: EventListener): void {
    const listeners =
      this.listeners.get(type) ?? new Set<(event: Event) => void>()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  close(): void {
    this.readyState = FakeEventSource.CLOSED
  }

  dispatch(type: string, payload: unknown): void {
    const event = new MessageEvent(type, { data: JSON.stringify(payload) })
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event)
    }
  }

  dispatchEvent(): boolean {
    return true
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.listeners.get(type)?.delete(listener)
  }
}

Object.assign(globalThis, {
  EventSource: FakeEventSource as unknown as typeof EventSource,
  IS_REACT_ACT_ENVIRONMENT: true,
})

const EMPTY_WINDOW = {
  asOf: '2026-08-30T00:00:00.000Z',
  buyCount: 0,
  buyVolumeUsd: 0,
  priceBaselineUsd: null,
  priceChangePercent: null,
  sellCount: 0,
  sellVolumeUsd: 0,
  totalTradeCount: 0,
  totalVolumeUsd: 0,
}

describe('LaunchpadLiveDataProvider', () => {
  let container: HTMLDivElement
  let queryClient: QueryClient
  let root: Root | null

  function render(
    address: EvmAddress,
    child: ReactNode = null,
    strict = false,
  ): void {
    const currentRoot = root
    if (!currentRoot) throw new Error('Test root is not mounted')

    const provider = createElement(
      LaunchpadLiveDataProvider,
      {
        chainId: CHAIN_ID,
        createdAt: CREATED_AT,
        tokenAddress: address,
      },
      child,
    )
    act(() => {
      currentRoot.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          strict ? createElement(StrictMode, null, provider) : provider,
        ),
      )
    })
  }

  function unmount(): void {
    const currentRoot = root
    if (!currentRoot) return

    act(() => currentRoot.unmount())
    root = null
  }

  async function waitForSources(count: number): Promise<void> {
    await act(async () => {
      await vi.waitFor(() => {
        expect(FakeEventSource.instances).toHaveLength(count)
      })
    })
  }

  beforeEach(() => {
    FakeEventSource.instances.length = 0
    mocks.getLaunchpadCandles.mockReset().mockResolvedValue({
      nodes: [],
      streamCursor: '40',
    })
    mocks.getLaunchpadTrades.mockReset().mockResolvedValue({
      edges: [],
      pageInfo: { endCursor: null, hasNextPage: false },
      streamCursor: '50',
      totalCount: 0,
    })
    mocks.getLaunchpadMarketStats.mockReset().mockResolvedValue({
      asOf: '2026-08-30T00:00:00.000Z',
      h1: EMPTY_WINDOW,
      h24: EMPTY_WINDOW,
      h6: EMPTY_WINDOW,
      m5: EMPTY_WINDOW,
      priceUsd: 1,
      streamCursor: '45',
    })
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    unmount()
    queryClient.clear()
    container.remove()
  })

  it('opens one stream before consumers mount and retains updates for them', async () => {
    let tradeCount = -1
    let latestMarketEventId: string | null = null

    function TradeProbe() {
      const trades = useLaunchpadLiveTrades()
      tradeCount = trades.data.edges.length
      return null
    }

    function MarketStatsProbe() {
      const marketStats = useLaunchpadLiveMarketStats()
      latestMarketEventId =
        marketStats.latestNewTradeEvent?.insertionEventId ?? null
      return null
    }

    function CandleProbe() {
      useLaunchpadCandleController()
      return null
    }

    render(TOKEN_ADDRESS)
    await waitForSources(1)

    const source = FakeEventSource.instances[0]!
    expect(new URL(source.url).searchParams.get('after')).toBe('40')

    act(() => {
      source.dispatch('trade.upsert', {
        amountUsd: 2,
        blockNumber: '100',
        chainId: CHAIN_ID,
        direction: 'BUY',
        eventId: '51',
        feeTier: 10_000,
        id: 'trade-1',
        isLaunchPool: true,
        isNew: true,
        logIndex: 1,
        marginalPriceUsd: 1.5,
        poolAddress: '0x3333333333333333333333333333333333333333',
        priceUsd: 1.5,
        quoteAmount: '2000000',
        quoteToken: {
          address: '0x4444444444444444444444444444444444444444',
          decimals: 6,
          name: 'USD Coin',
          symbol: 'USDC',
        },
        timestamp: '2026-08-30T00:00:01.000Z',
        tokenAddress: TOKEN_ADDRESS,
        tokenAmount: '1000000000000000000',
        trader: null,
        transactionHash: TRANSACTION_HASH,
      })
    })

    render(TOKEN_ADDRESS, createElement(TradeProbe))

    expect(FakeEventSource.instances).toHaveLength(1)
    expect(tradeCount).toBe(1)

    render(TOKEN_ADDRESS, createElement(MarketStatsProbe))

    expect(FakeEventSource.instances).toHaveLength(1)
    expect(latestMarketEventId).toBe('51')

    render(TOKEN_ADDRESS, createElement(CandleProbe))

    expect(FakeEventSource.instances).toHaveLength(1)

    render(TOKEN_ADDRESS)
    expect(FakeEventSource.instances).toHaveLength(1)
    expect(source.readyState).not.toBe(FakeEventSource.CLOSED)
  })

  it('opens the stream after the Strict Mode effect replay', async () => {
    const candleController = {
      current: null as ReturnType<typeof useLaunchpadCandleController> | null,
    }

    function CandleProbe() {
      candleController.current = useLaunchpadCandleController()
      return null
    }

    render(TOKEN_ADDRESS, createElement(CandleProbe), true)

    await waitForSources(1)

    expect(FakeEventSource.instances[0]?.readyState).not.toBe(
      FakeEventSource.CLOSED,
    )

    unmount()
    await new Promise<void>((resolve) => setTimeout(resolve))
    const candleRequestCount = mocks.getLaunchpadCandles.mock.calls.length

    expect(await candleController.current?.prefetchInitialSnapshot()).toBeNull()
    expect(mocks.getLaunchpadCandles).toHaveBeenCalledTimes(candleRequestCount)
  })

  it('keeps a successful trade snapshot visible while candles reconnect', async () => {
    const candleController = {
      current: null as ReturnType<typeof useLaunchpadCandleController> | null,
    }
    let streamStatus: string | null = null
    let tradeCount = -1

    function TradeProbe() {
      candleController.current = useLaunchpadCandleController()
      const trades = useLaunchpadLiveTrades()
      streamStatus = trades.streamStatus
      tradeCount = trades.data.totalCount
      return null
    }

    mocks.getLaunchpadCandles.mockRejectedValue(
      new Error('candle snapshot unavailable'),
    )
    mocks.getLaunchpadTrades.mockResolvedValue({
      edges: [],
      pageInfo: { endCursor: null, hasNextPage: false },
      streamCursor: '50',
      totalCount: 7,
    })

    render(TOKEN_ADDRESS, createElement(TradeProbe))
    await act(async () => {
      await vi.waitFor(() => {
        expect(streamStatus).toBe('reconnecting')
        expect(tradeCount).toBe(7)
      })
    })

    expect(FakeEventSource.instances).toHaveLength(0)

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    mocks.getLaunchpadCandles.mockResolvedValue({
      nodes: [],
      streamCursor: '40',
    })
    await act(async () => {
      await candleController.current?.prefetchInitialSnapshot()
    })

    expect(FakeEventSource.instances).toHaveLength(1)
    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('retries candle reset snapshots that precede the reset event', async () => {
    const candleController = {
      current: null as ReturnType<typeof useLaunchpadCandleController> | null,
    }

    function CandleProbe() {
      candleController.current = useLaunchpadCandleController()
      return null
    }

    render(TOKEN_ADDRESS, createElement(CandleProbe))
    await waitForSources(1)
    const tradeRequestCount = mocks.getLaunchpadTrades.mock.calls.length

    vi.useFakeTimers()
    const onReset = vi
      .fn()
      .mockResolvedValueOnce('44')
      .mockResolvedValueOnce('46')
    const unsubscribe = candleController.current?.subscribe({
      onRemove: vi.fn(),
      onReset,
      onUpdate: vi.fn(),
    })
    FakeEventSource.instances[0]?.dispatch('candle.reset', {
      chainId: CHAIN_ID,
      eventId: '45',
      tokenAddress: TOKEN_ADDRESS,
    })
    await act(async () => undefined)

    candleController.current?.publishSnapshot('44')
    expect(FakeEventSource.instances).toHaveLength(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(FakeEventSource.instances).toHaveLength(1)
    expect(onReset).toHaveBeenCalledTimes(2)
    expect(mocks.getLaunchpadTrades).toHaveBeenCalledTimes(tradeRequestCount)
    vi.useRealTimers()
    unsubscribe?.()
  })

  it('refetches when the small-trade filter changes during initialization', async () => {
    let resolveInitialTrades: (value: {
      edges: []
      pageInfo: { endCursor: null; hasNextPage: false }
      streamCursor: string
      totalCount: number
    }) => void = () => undefined
    const initialTrades = new Promise<{
      edges: []
      pageInfo: { endCursor: null; hasNextPage: false }
      streamCursor: string
      totalCount: number
    }>((resolve) => {
      resolveInitialTrades = resolve
    })
    mocks.getLaunchpadTrades
      .mockReset()
      .mockReturnValueOnce(initialTrades)
      .mockResolvedValueOnce({
        edges: [],
        pageInfo: { endCursor: null, hasNextPage: false },
        streamCursor: '51',
        totalCount: 2,
      })
    let setIncludeSmallTrades: ((include: boolean) => void) | null = null
    let tradeCount = -1

    function TradeProbe() {
      const trades = useLaunchpadLiveTrades()
      setIncludeSmallTrades = trades.setIncludeSmallTrades
      tradeCount = trades.data.totalCount
      return null
    }

    render(TOKEN_ADDRESS, createElement(TradeProbe))
    await act(async () => {
      await vi.waitFor(() => {
        expect(mocks.getLaunchpadTrades).toHaveBeenCalledOnce()
      })
    })

    act(() => setIncludeSmallTrades?.(true))
    await act(async () => {
      resolveInitialTrades({
        edges: [],
        pageInfo: { endCursor: null, hasNextPage: false },
        streamCursor: '50',
        totalCount: 1,
      })
      await vi.waitFor(() => {
        expect(tradeCount).toBe(2)
      })
    })

    expect(mocks.getLaunchpadTrades).toHaveBeenCalledTimes(2)
    expect(mocks.getLaunchpadTrades).toHaveBeenNthCalledWith(1, {
      input: expect.objectContaining({ includeSmallTrades: false }),
    })
    expect(mocks.getLaunchpadTrades).toHaveBeenNthCalledWith(2, {
      input: expect.objectContaining({ includeSmallTrades: true }),
    })
  })

  it('rejects trade snapshots with invalid stream cursors', async () => {
    let streamStatus: string | null = null
    let tradeCount = -1

    function TradeProbe() {
      const trades = useLaunchpadLiveTrades()
      streamStatus = trades.streamStatus
      tradeCount = trades.data.totalCount
      return null
    }

    mocks.getLaunchpadTrades.mockResolvedValue({
      edges: [],
      pageInfo: { endCursor: null, hasNextPage: false },
      streamCursor: 'invalid',
      totalCount: 7,
    })

    render(TOKEN_ADDRESS, createElement(TradeProbe))
    await act(async () => {
      await vi.waitFor(() => {
        expect(streamStatus).toBe('reconnecting')
      })
    })

    expect(tradeCount).toBe(0)
    expect(FakeEventSource.instances).toHaveLength(0)
  })

  it('closes the prior stream and controller when the token changes', async () => {
    render(TOKEN_ADDRESS)
    await waitForSources(1)
    const firstSource = FakeEventSource.instances[0]!

    render(OTHER_TOKEN_ADDRESS)
    await waitForSources(2)

    expect(firstSource.readyState).toBe(FakeEventSource.CLOSED)
    expect(
      new URL(FakeEventSource.instances[1]!.url).searchParams.get(
        'tokenAddress',
      ),
    ).toBe(OTHER_TOKEN_ADDRESS)

    unmount()
    expect(FakeEventSource.instances[1]!.readyState).toBe(
      FakeEventSource.CLOSED,
    )
  })
})
