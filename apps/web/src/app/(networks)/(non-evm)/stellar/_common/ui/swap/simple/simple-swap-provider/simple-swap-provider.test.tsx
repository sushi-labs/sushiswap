/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  STELLAR_USDC,
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  type StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  SimpleSwapProvider,
  useSimpleSwapActions,
  useSimpleSwapState,
} from './simple-swap-provider'

const mocks = vi.hoisted(() => ({
  params: new URLSearchParams(),
  getToken: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  usePathname: () => '/stellar/swap',
  useSearchParams: () => mocks.params,
}))
vi.mock('~stellar/_common/lib/soroban/token-helpers', () => ({
  getTokenByContract: mocks.getToken,
}))

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdt = STELLAR_USDT0[StellarChainId.STELLAR]
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
let root: Root
let container: HTMLDivElement
let client: QueryClient
let state: ReturnType<typeof useSimpleSwapState>
let actions: ReturnType<typeof useSimpleSwapActions>
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function Consumer(): string {
  state = useSimpleSwapState()
  actions = useSimpleSwapActions()
  return 'Swap ready'
}

async function render(params?: Record<string, string>): Promise<void> {
  if (params) {
    history.replaceState(
      null,
      '',
      `/stellar/swap?${new URLSearchParams(params)}`,
    )
  }
  mocks.params = new URLSearchParams(location.search)
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <SimpleSwapProvider>
          <Consumer />
        </SimpleSwapProvider>
      </QueryClientProvider>,
    )
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
}

function urlParams(): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(location.search))
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  history.replaceState(null, '', '/stellar/swap')
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  container = document.createElement('div')
  root = createRoot(container)
  mocks.getToken.mockResolvedValue(usdc)
})
afterEach(() => {
  act(() => root.unmount())
  client.clear()
  vi.useRealTimers()
})

it('uses defaults without fetching metadata or rewriting the URL', async () => {
  await render()
  expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '' })
  expect(mocks.getToken).not.toHaveBeenCalled()
  expect(urlParams()).toEqual({})
})

it.each(['token0', 'token1'] as const)(
  'resolves a pasted %s address and amount from the URL',
  async (field) => {
    await render({ [field]: usdc.address.toLowerCase(), swapAmount: '12.345' })
    expect(state[field]).toEqual(usdc)
    expect(state.amount).toBe('12.345')
    expect(mocks.getToken).toHaveBeenCalledWith(usdc.address)
  },
)

it.each([
  { swapAmount: '0x10', amountIn: 0n },
  { swapAmount: '1.2.3', amountIn: 0n },
  { swapAmount: '1e3', amountIn: 0n },
  { swapAmount: 'Infinity', amountIn: 0n },
  { swapAmount: '-1', amountIn: 0n },
  { swapAmount: '', amountIn: 0n },
  { swapAmount: '.', amountIn: 0n },
  { swapAmount: '0', amountIn: 0n },
  { swapAmount: '0.00000001', amountIn: 0n },
  { swapAmount: '.5', amountIn: 5_000_000n },
  { swapAmount: '1.', amountIn: 10_000_000n },
  { swapAmount: '1.00000009', amountIn: 10_000_001n },
  { swapAmount: '900719925.4740993', amountIn: 9_007_199_254_740_993n },
])(
  'parses URL amount $swapAmount using EVM semantics',
  async ({ swapAmount, amountIn }) => {
    await render({ swapAmount })
    expect(state.amountIn).toBe(amountIn)
    expect(state.amount).toBe(swapAmount)
    expect(urlParams().swapAmount).toBe(swapAmount)
  },
)

it.each(['setToken0', 'setToken1'] as const)(
  '%s writes the selected address and preserves the amount and unrelated params',
  async (action) => {
    await render({ swapAmount: '10', utm_source: 'test' })
    act(() => actions[action](usdc))
    expect(urlParams()).toEqual({
      token0: action === 'setToken0' ? usdc.address : xlm.address,
      token1: action === 'setToken1' ? usdc.address : usdt.address,
      swapAmount: '10',
      utm_source: 'test',
    })
    await render()
    expect(state[action === 'setToken0' ? 'token0' : 'token1']).toEqual(usdc)
    expect(state.amount).toBe('10')
    expect(mocks.getToken).not.toHaveBeenCalled()
  },
)

it.each(['swapTokens', 'setToken0', 'setToken1'] as const)(
  '%s swaps the URL addresses and removes the amount when choosing the opposite token',
  async (action) => {
    await render({ swapAmount: '10', utm_source: 'test' })
    act(() => {
      if (action === 'swapTokens') actions.swapTokens()
      else actions[action](action === 'setToken0' ? usdt : xlm)
    })
    expect(urlParams()).toEqual({
      token0: usdt.address,
      token1: xlm.address,
      utm_source: 'test',
    })
    await render()
    expect(state).toMatchObject({ token0: usdt, token1: xlm, amount: '' })
  },
)

it('writes amount edits to the URL and removes the parameter when cleared', async () => {
  await render({ utm_source: 'test' })
  act(() => actions.setAmount('2.5'))
  await render()
  expect(state.amount).toBe('2.5')
  expect(urlParams()).toMatchObject({ swapAmount: '2.5', utm_source: 'test' })
  act(() => actions.setAmount(''))
  await render()
  expect(state.amount).toBe('')
  expect(urlParams()).not.toHaveProperty('swapAmount')
})

it('derives state again when navigation changes the URL', async () => {
  await render({ token0: usdc.address, token1: xlm.address, swapAmount: '10' })
  act(() => actions.swapTokens())
  await render()
  expect(state).toMatchObject({ token0: xlm, token1: usdc, amount: '' })
  await render({ token0: usdc.address, token1: xlm.address, swapAmount: '10' })
  expect(state).toMatchObject({ token0: usdc, token1: xlm, amount: '10' })
})

it('waits for requested metadata before rendering the swap with defined tokens', async () => {
  let resolve!: (token: StellarToken) => void
  mocks.getToken.mockReturnValue(
    new Promise<StellarToken>((done) => {
      resolve = done
    }),
  )
  await render({ token0: usdc.address, swapAmount: '10' })
  expect(container.textContent).toBe('Loading tokens...')
  await act(async () => resolve(usdc))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(container.textContent).toBe('Swap ready')
  expect(state).toMatchObject({ token0: usdc, token1: usdt, amount: '10' })
})

it('ignores results for a previous URL while tokens are loading', async () => {
  let resolve!: (token: StellarToken) => void
  mocks.getToken.mockReturnValue(
    new Promise<StellarToken>((done) => {
      resolve = done
    }),
  )
  await render({ token0: usdc.address, swapAmount: '10' })
  expect(container.textContent).toBe('Loading tokens...')
  await render({ token0: xlm.address, swapAmount: '10' })
  await act(async () => resolve(usdc))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '10' })
  expect(urlParams().token0).toBe(xlm.address)
})

it.each([
  'invalid',
  '',
  'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
])(
  'does not render a swap or substitute defaults for token parameter %s',
  async (token0) => {
    await render({ token0, swapAmount: '10' })
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to load selected tokens.',
    )
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/stellar/swap',
    )
    expect(container.textContent).not.toContain('Swap ready')
    expect(mocks.getToken).not.toHaveBeenCalled()
  },
)

it('does not render a swap when metadata lookup fails', async () => {
  mocks.getToken.mockRejectedValue(new Error('Unavailable'))
  await render({ token1: usdc.address, swapAmount: '10' })
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'Unable to load selected tokens.',
  )
  expect(container.textContent).not.toContain('Swap ready')
})
