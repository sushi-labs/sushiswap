/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { type ButtonHTMLAttributes, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { useCountryCode } from 'src/lib/hooks/use-country-code'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { SvmChainId, SvmNative } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  StockTokenRegion,
  type StockTokenRegionProps,
} from './stock-token-region'

vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    disabled,
    onClick,
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const stock = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0xd95b44124e475743a7589e68f3d74008a5536d44',
  decimals: 18,
  symbol: 'CRM',
  name: 'Salesforce stock',
})
const otherStock = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 18,
  symbol: 'XYZ',
  name: 'XYZ stock',
})
const imitation = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'CRM',
  name: 'Imitation stock',
})
const otherChain = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: stock.address,
  decimals: 18,
  symbol: stock.symbol,
  name: stock.name,
})
const registry = {
  assets: [stock, otherStock].map((token) => ({
    tokenSymbol: token.symbol,
    tokenName: `${token.symbol} stock`,
    deployments: [{ chainId: token.chainId, contractAddress: token.address }],
  })),
}

describe('StockTokenRegion and country lookup', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  const fetchMock = vi.fn<typeof fetch>()
  const onSwap = vi.fn()

  function respond(countryCode: unknown = 'US', assets: unknown = registry) {
    fetchMock.mockImplementation(async (url) => {
      if (url === '/api/robinhood/stock-tokens') return Response.json(assets)
      if (url === '/api/geolocation') return Response.json({ countryCode })
      throw new Error(`Unexpected request: ${url}`)
    })
  }

  async function advance() {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20)
    })
  }

  async function render(props: StockTokenRegionProps = { token0: stock }) {
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <StockTokenRegion {...props}>
            <button type="button" onClick={onSwap}>
              Swap
            </button>
          </StockTokenRegion>
        </QueryClientProvider>,
      )
    })
    await advance()
  }

  function expectBlocked(text: string) {
    expect(container.textContent).toBe(text)
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    act(() => button?.click())
    expect(onSwap).not.toHaveBeenCalled()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.resetAllMocks()
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')
    vi.stubGlobal('fetch', fetchMock)
    respond()
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({
      defaultOptions: { queries: { retry: false, retryDelay: 0, gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    notifyManager.setNotifyFunction((callback) => callback())
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it.each([
    { nodeEnv: 'development', appEnv: undefined },
    { nodeEnv: 'development', appEnv: 'production' },
    { nodeEnv: 'production', appEnv: 'test' },
  ])(
    'bypasses both lookups in $nodeEnv with app environment $appEnv',
    async ({ nodeEnv, appEnv }) => {
      vi.stubEnv('NODE_ENV', nodeEnv)
      vi.stubEnv('NEXT_PUBLIC_APP_ENV', appEnv)
      await render({ token0: stock, token1: otherStock })
      expect(container.textContent).toBe('Swap')
      expect(fetchMock).not.toHaveBeenCalled()
      act(() => container.querySelector('button')?.click())
      expect(onSwap).toHaveBeenCalledOnce()
    },
  )

  it.each([undefined, 'production', 'preview'])(
    'enforces restrictions in production with app environment %s',
    async (appEnv) => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_APP_ENV', appEnv)
      await render()
      expectBlocked('CRM unavailable in your region')
    },
  )

  it.each([
    {},
    { token0: otherChain },
    { token1: otherChain },
    { token0: EvmNative.fromChainId(EvmChainId.ROBINHOOD) },
    { token0: SvmNative.fromChainId(SvmChainId.SOLANA) },
  ])(
    'skips both lookups for non-Robinhood tokens or native currencies: %j',
    async (props) => {
      await render(props)
      expect(container.textContent).toBe('Swap')
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('does not check country or block a token imitating a stock symbol', async () => {
    await render({ token0: imitation })
    expect(container.textContent).toBe('Swap')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/robinhood/stock-tokens')
  })

  it.each(['token0', 'token1'] as const)(
    'blocks a stock selected as %s even when the other token is on another chain',
    async (side) => {
      await render({ token0: otherChain, [side]: stock, disabled: false })
      expectBlocked('CRM unavailable in your region')
    },
  )

  it.each([
    'US',
    'CA',
    'GB',
    'CH',
    'CU',
    'BY',
    'IR',
    'KP',
    'RU',
    'SY',
    'UA',
    'SS',
    'SD',
    'MM',
    'VE',
  ])('blocks the documented restricted country %s', async (country) => {
    respond(country)
    await render()
    expectBlocked('CRM unavailable in your region')
  })

  it('normalizes the country code and fetches it without browser caching', async () => {
    respond(' us ')
    await render()
    expectBlocked('CRM unavailable in your region')
    expect(fetchMock).toHaveBeenCalledWith('/api/geolocation', {
      cache: 'no-store',
      signal: expect.any(AbortSignal),
    })
  })

  it.each(['DE', 'FR', 'AU', 'JP'])(
    'allows a stock in unrestricted country %s',
    async (country) => {
      respond(country)
      await render()
      expect(container.textContent).toBe('Swap')
      act(() => container.querySelector('button')?.click())
      expect(onSwap).toHaveBeenCalledOnce()
    },
  )

  it('names both stocks and deduplicates the label for the same stock', async () => {
    await render({ token0: stock, token1: otherStock })
    expectBlocked('CRM, XYZ unavailable in your region')
    await render({ token0: stock, token1: stock })
    expectBlocked('CRM unavailable in your region')
  })

  it('updates when the user switches tokens or chains', async () => {
    await render()
    expectBlocked('CRM unavailable in your region')
    await render({ token0: otherStock })
    expectBlocked('XYZ unavailable in your region')
    await render({ token0: imitation })
    expect(container.textContent).toBe('Swap')
    await render({ token1: stock })
    expectBlocked('CRM unavailable in your region')
    await render({ token0: otherChain })
    expect(container.textContent).toBe('Swap')
  })

  it('blocks while the registry is loading and skips country lookup', async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))
    await render()
    expectBlocked('Checking token availability')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('blocks while country lookup is loading', async () => {
    fetchMock.mockImplementation(async (url) => {
      if (url === '/api/robinhood/stock-tokens') return Response.json(registry)
      return new Promise(() => {})
    })
    await render()
    expectBlocked('Checking your region')
  })

  it.each([null, '', 'USA', 123])(
    'blocks unavailable or malformed country data: %j',
    async (country) => {
      respond(country)
      await render()
      expectBlocked('Unable to verify your region')
    },
  )

  it('blocks failed country requests', async () => {
    fetchMock.mockImplementation(async (url) =>
      url === '/api/robinhood/stock-tokens'
        ? Response.json(registry)
        : new Response(null, { status: 503 }),
    )
    await render()
    expectBlocked('Unable to verify your region')
  })

  it.each([null, { assets: [{ deployments: [] }] }])(
    'blocks malformed stock registries: %j',
    async (assets) => {
      respond('US', assets)
      await render()
      expectBlocked('Unable to verify stock tokens')
      expect(fetchMock).toHaveBeenCalledTimes(1)
    },
  )

  it('blocks failed registry requests', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 502 }))
    await render()
    expectBlocked('Unable to verify stock tokens')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shares the reusable country hook query between consumers', async () => {
    function Country() {
      const { data } = useCountryCode()
      return <span>{data}</span>
    }
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <Country />
          <Country />
        </QueryClientProvider>,
      )
    })
    await advance()
    expect(container.textContent).toBe('USUS')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
