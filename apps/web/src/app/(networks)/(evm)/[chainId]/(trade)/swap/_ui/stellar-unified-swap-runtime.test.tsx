/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { SwapEdgeConfig } from '~stellar/_common/lib/edge/get-swap-edge-config'
import { useEdgeConfig } from '~stellar/_common/providers/edge-config-provider'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { StellarUnifiedSwapRuntime } from './stellar-unified-swap-runtime'

const mocks = vi.hoisted(() => ({
  params: new URLSearchParams(),
  getToken: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/swap',
  useSearchParams: () => mocks.params,
}))
vi.mock('~stellar/_common/lib/soroban/token-helpers', () => ({
  getTokenByContract: mocks.getToken,
}))
vi.mock('~stellar/providers', () => ({
  Providers: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('~stellar/swap/loading', () => ({
  default: () => <span>Loading Stellar tokens</span>,
}))
vi.mock('~stellar/_common/ui/swap/simple/simple-swap-widget', () => ({
  SimpleSwapWidget: function Widget() {
    const { token0, token1, amount } = useSimpleSwapState()
    const { maintenance } = useEdgeConfig<SwapEdgeConfig>()
    actions = useSimpleSwapActions()
    return (
      <span data-maintenance={maintenance}>
        {`${token0.symbol}/${token1.symbol}: ${amount}`}
      </span>
    )
  },
}))

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdt = STELLAR_USDT0[StellarChainId.STELLAR]
const custom = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})
let container: HTMLDivElement
let root: Root
let client: QueryClient
let actions: ReturnType<typeof useSimpleSwapActions>

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  history.replaceState(null, '', '/swap')
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  container = document.createElement('div')
  root = createRoot(container)
  mocks.getToken.mockResolvedValue(custom)
})

afterEach(() => {
  act(() => root.unmount())
  client.clear()
  vi.useRealTimers()
})

async function render(params?: Record<string, string>): Promise<void> {
  if (params) {
    history.replaceState(null, '', `/swap?${new URLSearchParams(params)}`)
  }
  mocks.params = new URLSearchParams(location.search)
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <StellarUnifiedSwapRuntime config={{ maintenance: true }} />
      </QueryClientProvider>,
    )
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
}

it('uses the tokens and amount from the URL and provides the edge config', async () => {
  await render({ token0: usdt.address, token1: xlm.address, swapAmount: '12' })
  expect(container.textContent).toBe(`${usdt.symbol}/${xlm.symbol}: 12`)
  expect(container.querySelector('span')?.dataset.maintenance).toBe('true')
  expect(mocks.getToken).not.toHaveBeenCalled()
})

it('uses the provider defaults when the URL has no token parameters', async () => {
  await render()
  expect(container.textContent).toBe(`${xlm.symbol}/${usdt.symbol}: `)
})

it('waits for the provider to resolve a non-base token from the URL', async () => {
  let resolve!: (token: StellarToken) => void
  mocks.getToken.mockReturnValue(
    new Promise<StellarToken>((done) => {
      resolve = done
    }),
  )
  await render({
    token0: xlm.address,
    token1: custom.address.toLowerCase(),
    swapAmount: '12',
  })
  expect(container.textContent).toBe('Loading Stellar tokens')
  expect(mocks.getToken).toHaveBeenCalledWith(custom.address, { strict: true })

  await act(async () => resolve(custom))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 12`)
})

it('updates the widget when navigation changes the URL pair and amount', async () => {
  await render({ token0: xlm.address, token1: usdt.address, swapAmount: '12' })
  await render({ token0: usdt.address, token1: xlm.address, swapAmount: '3.5' })
  expect(container.textContent).toBe(`${usdt.symbol}/${xlm.symbol}: 3.5`)
})

it('writes widget edits to the URL while preserving the unified chain parameters', async () => {
  const chainParams = {
    chainId0: String(StellarChainId.STELLAR),
    chainId1: String(StellarChainId.STELLAR),
  }
  await render({ ...chainParams, token0: xlm.address, token1: usdt.address })
  act(() => actions.setToken1(custom))
  await render()
  act(() => actions.setAmount('2.5'))
  await render()

  expect(Object.fromEntries(new URLSearchParams(location.search))).toEqual({
    ...chainParams,
    token0: xlm.address,
    token1: custom.address,
    swapAmount: '2.5',
  })
  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 2.5`)
  expect(mocks.getToken).not.toHaveBeenCalled()
})
