import type { LaunchpadTradeConnection } from '@sushiswap/graph-client/data-api'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EMPTY_TRADE_CONNECTION } from './launchpad-stream'
import { useLaunchpadLiveTrades } from './use-launchpad-live-trades'

const mocks = vi.hoisted(() => ({
  getLaunchpadCandles: vi.fn(),
  refetch: vi.fn(),
  stateSetters: [] as ReturnType<typeof vi.fn>[],
  stateValues: [] as unknown[],
}))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadCandles: mocks.getLaunchpadCandles,
  getLaunchpadTrades: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: () => ({
    data: undefined,
    isSuccess: false,
    refetch: mocks.refetch,
  }),
  useQueryClient: () => ({
    refetchQueries: vi.fn().mockResolvedValue(undefined),
    setQueriesData: vi.fn(),
  }),
}))

vi.mock('react', () => ({
  useEffect: (effect: () => undefined | (() => void)) => {
    effect()
  },
  useMemo: <T>(factory: () => T) => factory(),
  useRef: <T>(value: T) => ({ current: value }),
  useState: <T>(initialValue: T) => {
    const index = mocks.stateValues.length
    mocks.stateValues.push(initialValue)
    const setter = vi.fn((next: T | ((current: T) => T)) => {
      const current = mocks.stateValues[index] as T
      mocks.stateValues[index] =
        typeof next === 'function' ? (next as (current: T) => T)(current) : next
    })
    mocks.stateSetters.push(setter)
    return [initialValue, setter]
  },
}))

const CHAIN_ID = 4663
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'

class MockEventSource extends EventTarget {
  static readonly CLOSED = 2
  static instances: MockEventSource[] = []

  readyState = 1
  onerror: ((event: Event) => void) | null = null
  onopen: ((event: Event) => void) | null = null

  constructor(_url: string | URL) {
    super()
    MockEventSource.instances.push(this)
  }

  close(): void {
    this.readyState = MockEventSource.CLOSED
  }
}

function createConnection(streamCursor = '40'): LaunchpadTradeConnection {
  return {
    edges: [
      {
        cursor: streamCursor,
        node: {
          id: 'trade-1',
          chainId: CHAIN_ID,
          tokenAddress: TOKEN_ADDRESS,
          poolAddress: '0x2222222222222222222222222222222222222222',
          feeTier: 10_000,
          isLaunchPool: true,
          transactionHash:
            '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          logIndex: 1,
          blockNumber: '100',
          timestamp: '2026-08-28T00:00:00.000Z',
          trader: null,
          direction: 'BUY',
          tokenAmount: '1000000000000000000',
          quoteToken: {
            address: '0x3333333333333333333333333333333333333333',
            symbol: 'SUSHI',
            name: 'Sushi',
            decimals: 18,
          },
          quoteAmount: '2000000000000000000',
          priceUsd: 2,
          amountUsd: 2,
        },
      },
    ],
    pageInfo: { endCursor: null, hasNextPage: false },
    streamCursor,
    totalCount: 1,
  }
}

function createDeferred<T>(): {
  promise: Promise<T>
  resolve: (value: T) => void
} {
  let resolve: (value: T) => void = () => undefined
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve
  })
  return { promise, resolve }
}

describe('useLaunchpadLiveTrades reset handling', () => {
  beforeEach(() => {
    mocks.getLaunchpadCandles.mockReset()
    mocks.refetch.mockReset()
    mocks.stateSetters.length = 0
    mocks.stateValues.length = 0
    MockEventSource.instances.length = 0
    vi.stubGlobal('EventSource', MockEventSource)
  })

  it('keeps the last good trades visible while a reset snapshot is pending', async () => {
    const initialConnection = createConnection()
    mocks.getLaunchpadCandles.mockResolvedValue({
      nodes: [],
      streamCursor: '40',
    })
    mocks.refetch.mockResolvedValueOnce({
      data: { pages: [initialConnection] },
      isError: false,
    })

    useLaunchpadLiveTrades({
      chainId: CHAIN_ID,
      tokenAddress: TOKEN_ADDRESS,
      first: 20,
    })

    await vi.waitFor(() => {
      expect(mocks.stateValues[0]).toEqual(initialConnection)
      expect(MockEventSource.instances).toHaveLength(1)
    })
    const setData = mocks.stateSetters[0]
    expect(setData).toBeDefined()
    setData?.mockClear()

    const resetSnapshot = createDeferred<{
      data: { pages: LaunchpadTradeConnection[] }
      isError: boolean
    }>()
    mocks.refetch.mockReturnValueOnce(resetSnapshot.promise)
    MockEventSource.instances[0]?.dispatchEvent(
      Object.assign(new Event('trade.reset'), {
        data: JSON.stringify({
          chainId: CHAIN_ID,
          tokenAddress: TOKEN_ADDRESS,
          eventId: '41',
        }),
      }),
    )

    expect(setData).not.toHaveBeenCalledWith(EMPTY_TRADE_CONNECTION)
    expect(mocks.stateValues[0]).toEqual(initialConnection)

    resetSnapshot.resolve({
      data: { pages: [createConnection('41')] },
      isError: false,
    })
    await vi.waitFor(() => {
      expect(
        (mocks.stateValues[0] as LaunchpadTradeConnection).streamCursor,
      ).toBe('41')
    })
  })
})
