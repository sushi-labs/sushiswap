/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, act, createElement } from 'react'
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

  function render(address: EvmAddress, child: ReactNode = null): void {
    const currentRoot = root
    if (!currentRoot) throw new Error('Test root is not mounted')

    act(() => {
      currentRoot.render(
        createElement(
          QueryClientProvider,
          { client: queryClient },
          createElement(
            LaunchpadLiveDataProvider,
            {
              chainId: CHAIN_ID,
              createdAt: CREATED_AT,
              tokenAddress: address,
            },
            child,
          ),
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
