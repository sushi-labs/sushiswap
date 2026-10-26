/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { type ButtonHTMLAttributes, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { SvmChainId, SvmNative } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GeoBlockedTokens,
  type GeoBlockedTokensProps,
} from './geo-blocked-tokens'

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

const restricted = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const imitation = new StellarToken({
  ...usdc.toJSON(),
  symbol: restricted.symbol,
  name: restricted.name,
})
const otherChain = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: restricted.symbol,
  name: restricted.name,
})

describe('GeoBlockedTokens', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  const fetchMock = vi.fn<typeof fetch>()
  const onSubmit = vi.fn()

  function respond(countryCode: unknown = 'US'): void {
    fetchMock.mockImplementation(async (url) => {
      if (url === '/api/geolocation') return Response.json({ countryCode })
      throw new Error(`Unexpected request: ${url}`)
    })
  }

  async function render(
    props: GeoBlockedTokensProps = { token0: restricted },
  ): Promise<void> {
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <GeoBlockedTokens {...props}>
            <button type="button" onClick={onSubmit}>
              Submit
            </button>
          </GeoBlockedTokens>
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20)
    })
  }

  function expectBlocked(text: string): void {
    expect(container.textContent).toBe(text)
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    act(() => button?.click())
    expect(onSubmit).not.toHaveBeenCalled()
  }

  function expectAllowed(): void {
    expect(container.textContent).toBe('Submit')
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(false)
    act(() => button?.click())
    expect(onSubmit).toHaveBeenCalledOnce()
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.resetAllMocks()
    vi.stubEnv('NODE_ENV', 'production')
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

  it.each(['token0', 'token1'] as const)(
    'blocks deHYB as %s even when the other token is on another chain',
    async (side) => {
      await render({ token0: otherChain, [side]: restricted, disabled: false })
      expectBlocked('deHYB unavailable in your region')
    },
  )

  it('checks additional tokens such as a third zap input', async () => {
    await render({ token0: usdc, token1: xlm, tokens: [undefined, restricted] })
    expectBlocked('deHYB unavailable in your region')
  })

  it('deduplicates labels when the same restricted token appears more than once', async () => {
    await render({
      token0: restricted,
      token1: restricted,
      tokens: [restricted],
    })
    expectBlocked('deHYB unavailable in your region')
  })

  it.each([
    {},
    { token0: usdc, token1: xlm },
    { token0: imitation },
    { token1: otherChain },
    { token0: EvmNative.fromChainId(EvmChainId.ETHEREUM) },
    { token0: SvmNative.fromChainId(SvmChainId.SOLANA) },
    { tokens: [undefined, usdc, otherChain] },
  ])('skips country lookup for unrestricted currencies: %j', async (props) => {
    await render(props)
    expectAllowed()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('matches the restricted contract even if its displayed metadata changes', async () => {
    const renamed = new StellarToken({
      ...restricted.toJSON(),
      symbol: 'Other symbol',
      name: 'Other name',
    })
    await render({ token0: renamed })
    expectBlocked('Other symbol unavailable in your region')
  })

  it.each(['CA', 'GB', 'DE', 'JP'])(
    'allows deHYB outside the US in %s',
    async (country) => {
      respond(country)
      await render()
      expectAllowed()
    },
  )

  it('normalizes country data and bypasses browser caching', async () => {
    respond(' us ')
    await render()
    expectBlocked('deHYB unavailable in your region')
    expect(fetchMock).toHaveBeenCalledWith('/api/geolocation', {
      cache: 'no-store',
      signal: expect.any(AbortSignal),
    })
  })

  it('blocks until the country lookup completes', async () => {
    fetchMock.mockImplementation(() => new Promise(() => {}))
    await render()
    expectBlocked('Checking your region')
  })

  it.each([null, '', 'USA', 123, undefined])(
    'blocks unavailable or malformed country data: %j',
    async (country) => {
      fetchMock.mockResolvedValue(Response.json({ countryCode: country }))
      await render()
      expectBlocked('Unable to verify your region')
    },
  )

  it('blocks failed country requests', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }))
    await render()
    expectBlocked('Unable to verify your region')
  })

  it('updates when the user switches tokens', async () => {
    await render()
    expectBlocked('deHYB unavailable in your region')
    await render({ token0: imitation })
    expect(container.textContent).toBe('Submit')
    await render({ token1: restricted })
    expectBlocked('deHYB unavailable in your region')
    await render({ token0: otherChain })
    expect(container.textContent).toBe('Submit')
  })

  it.each([undefined, 'production', 'preview'])(
    'enforces production restrictions with app environment %s',
    async (appEnv) => {
      vi.stubEnv('NEXT_PUBLIC_APP_ENV', appEnv)
      await render()
      expectBlocked('deHYB unavailable in your region')
    },
  )

  it.each([
    { nodeEnv: 'development', appEnv: undefined },
    { nodeEnv: 'development', appEnv: 'production' },
    { nodeEnv: 'production', appEnv: 'test' },
  ])(
    'bypasses lookup in $nodeEnv with app environment $appEnv',
    async ({ nodeEnv, appEnv }) => {
      vi.stubEnv('NODE_ENV', nodeEnv)
      vi.stubEnv('NEXT_PUBLIC_APP_ENV', appEnv)
      await render({ token0: restricted, tokens: [restricted] })
      expectAllowed()
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )
})
