/** @vitest-environment jsdom */

import { Buffer } from 'node:buffer'
import { StrKey } from '@stellar/stellar-sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  STELLAR_USDC,
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  type StellarContractAddress,
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
const missingContract = StrKey.encodeContract(Buffer.alloc(32))
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
    expect(mocks.getToken).toHaveBeenCalledWith(usdc.address, { strict: true })
  },
)

it.each<{ name: string; params: Record<string, string> }>([
  { name: 'missing token0', params: { token1: xlm.address } },
  {
    name: 'invalid token0',
    params: { token0: 'invalid', token1: xlm.address },
  },
  {
    name: 'nonexistent token0',
    params: { token0: missingContract, token1: xlm.address },
  },
  { name: 'missing token1', params: { token0: usdt.address } },
  {
    name: 'invalid token1',
    params: { token0: usdt.address, token1: 'invalid' },
  },
  {
    name: 'nonexistent token1',
    params: { token0: usdt.address, token1: missingContract },
  },
])(
  'preserves the requested token when $name would duplicate it',
  async ({ params }) => {
    mocks.getToken.mockRejectedValue(new Error('Contract does not exist'))
    await render({ ...params, swapAmount: '10', utm_source: 'test' })
    expect(container.textContent).toBe('Swap ready')
    expect(state).toMatchObject({ token0: usdt, token1: xlm, amount: '10' })
    act(() => actions.setAmount('2.5'))
    expect(urlParams()).toEqual({
      token0: usdt.address,
      token1: xlm.address,
      swapAmount: '2.5',
      utm_source: 'test',
    })
    await render()
    act(() => actions.setToken0(xlm))
    await render()
    expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '' })
    expect(urlParams()).toEqual({
      token0: xlm.address,
      token1: usdt.address,
      utm_source: 'test',
    })
  },
)

it.each([xlm, usdt, usdc])(
  'keeps token0 when both URL parameters contain $symbol',
  async (token) => {
    await render({
      token0: token.address,
      token1: token.address.toLowerCase(),
      swapAmount: '10',
    })
    const alternate = token.address === usdt.address ? xlm : usdt
    expect(container.textContent).toBe('Swap ready')
    expect(state).toMatchObject({
      token0: token,
      token1: alternate,
      amount: '10',
    })
    act(() => actions.swapTokens())
    expect(urlParams()).toEqual({
      token0: alternate.address,
      token1: token.address,
    })
    await render()
    expect(state).toMatchObject({
      token0: alternate,
      token1: token,
      amount: '',
    })
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
  expect(container.querySelector('.animate-pulse')).not.toBeNull()
  expect(container.textContent).not.toContain('Swap ready')
  await act(async () => resolve(usdc))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(container.textContent).toBe('Swap ready')
  expect(container.querySelector('.animate-pulse')).toBeNull()
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
  expect(container.querySelector('.animate-pulse')).not.toBeNull()
  await render({ token0: xlm.address, swapAmount: '10' })
  await act(async () => resolve(usdc))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '10' })
  expect(urlParams().token0).toBe(xlm.address)
})

it.each(
  (['token0', 'token1'] as const).flatMap((field) =>
    [
      'invalid',
      '',
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      `C${'A'.repeat(55)}`,
    ].map((address) => ({ field, address })),
  ),
)(
  'falls back immediately for invalid $field address $address',
  async ({ field, address }) => {
    await render({ [field]: address, swapAmount: '10' })
    expect(container.textContent).toBe('Swap ready')
    expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '10' })
    expect(mocks.getToken).not.toHaveBeenCalled()
  },
)

it('ignores cached metadata for an invalid contract address', async () => {
  const address = `C${'A'.repeat(55)}`
  client.setQueryData(['stellar', 'token', address], usdc)
  await render({ token0: address, token1: address })
  expect(container.textContent).toBe('Swap ready')
  expect(state).toMatchObject({ token0: xlm, token1: usdt })
  expect(mocks.getToken).not.toHaveBeenCalled()
})

it('uses independent defaults when both parameters reference a nonexistent contract', async () => {
  mocks.getToken.mockRejectedValue(new Error('Contract does not exist'))
  await render({
    token0: missingContract,
    token1: missingContract,
    swapAmount: '10',
  })
  expect(container.textContent).toBe('Swap ready')
  expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '10' })
  expect(mocks.getToken).toHaveBeenCalledWith(missingContract, { strict: true })
})

it.each(['token0', 'token1'] as const)(
  'falls back for a failed %s lookup while preserving the other token',
  async (field) => {
    mocks.getToken.mockImplementation(
      async (address: StellarContractAddress) => {
        if (address === missingContract)
          throw new Error('Contract does not exist')
        return usdc
      },
    )
    await render({
      token0: field === 'token0' ? missingContract : usdc.address,
      token1: field === 'token1' ? missingContract : usdc.address,
      swapAmount: '10',
    })
    expect(container.textContent).toBe('Swap ready')
    expect(state).toMatchObject({
      token0: field === 'token0' ? xlm : usdc,
      token1: field === 'token1' ? usdt : usdc,
      amount: '10',
    })
  },
)

it.each(['swapTokens', 'setToken0', 'setToken1'] as const)(
  '%s uses the displayed pair after a failed lookup and clears the URL amount',
  async (action) => {
    mocks.getToken.mockRejectedValue(new Error('Contract does not exist'))
    await render({
      token0: missingContract,
      token1: 'invalid',
      swapAmount: '10',
      utm_source: 'test',
    })
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

it('writes the displayed pair when the amount changes after fallback', async () => {
  mocks.getToken.mockRejectedValue(new Error('Contract does not exist'))
  await render({
    token0: 'invalid',
    token1: missingContract,
    utm_source: 'test',
  })
  act(() => actions.setAmount('2.5'))
  expect(urlParams()).toEqual({
    token0: xlm.address,
    token1: usdt.address,
    swapAmount: '2.5',
    utm_source: 'test',
  })
  await render()
  expect(state).toMatchObject({ token0: xlm, token1: usdt, amount: '2.5' })
})

it('preserves the amount and uses a cached selection after fallback', async () => {
  mocks.getToken.mockRejectedValue(new Error('Contract does not exist'))
  await render({ token0: missingContract, token1: 'invalid', swapAmount: '10' })
  act(() => actions.setToken0(usdc))
  await render()
  expect(state).toMatchObject({ token0: usdc, token1: usdt, amount: '10' })
  expect(urlParams()).toEqual({
    token0: usdc.address,
    token1: usdt.address,
    swapAmount: '10',
  })
})

it('ignores a failed lookup after navigating to another pair', async () => {
  let reject!: (error: Error) => void
  mocks.getToken.mockReturnValue(
    new Promise<StellarToken>((_, fail) => {
      reject = fail
    }),
  )
  await render({ token0: missingContract, swapAmount: '10' })
  expect(container.querySelector('.animate-pulse')).not.toBeNull()
  await render({ token0: usdt.address, token1: xlm.address, swapAmount: '3' })
  await act(async () => reject(new Error('Contract does not exist')))
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
  expect(state).toMatchObject({ token0: usdt, token1: xlm, amount: '3' })
})
