/** @vitest-environment jsdom */

import { type ReactNode, act, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { UnifiedSwapState } from 'src/lib/swap/unified-swap-context'
import {
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { StellarUnifiedSwapRuntime } from './stellar-unified-swap-runtime'

const mocks = vi.hoisted(() => ({
  form: vi.fn(),
  search: vi.fn(),
  catalog: vi.fn(),
  catalogCurrency: vi.fn(),
}))

vi.mock('src/lib/swap/unified-swap-context', () => ({
  useUnifiedSwap: mocks.form,
}))
vi.mock(
  'src/lib/wagmi/components/token-selector/hooks/use-search-tokens',
  () => ({ useSearchTokens: mocks.search }),
)
vi.mock(
  '../../cross-chain-swap/_ui/layerzero/hooks/use-value-transfer-catalog',
  () => ({ useValueTransferCatalog: mocks.catalog }),
)
vi.mock('src/lib/wagmi/components/web3-input/currency', () => ({
  CurrencyInput: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}))
vi.mock('~stellar/providers', () => ({
  Providers: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('~stellar/_common/providers/edge-config-provider', () => ({
  EdgeProvider: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('~stellar/_common/ui/swap/simple/simple-swap-widget', () => ({
  SimpleSwapWidget: function Widget() {
    const { token0, token1, amount, outputAmount } = useSimpleSwapState()
    quoteActions = useSimpleSwapActions()
    const [pending, setPending] = useState(false)
    setWidgetPending = setPending
    return (
      <span data-output={outputAmount.toString()} data-pending={pending}>
        {`${token0.symbol}/${token1.symbol}: ${amount}`}
      </span>
    )
  },
}))
vi.mock('@sushiswap/ui', () => ({
  Message: ({ children }: { children: ReactNode }) => <p>{children}</p>,
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
let form: UnifiedSwapState
let quoteActions: ReturnType<typeof useSimpleSwapActions>
let setWidgetPending: (pending: boolean) => void

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.clearAllMocks()
  container = document.createElement('div')
  root = createRoot(container)
  form = {
    chainId0: StellarChainId.STELLAR,
    chainId1: StellarChainId.STELLAR,
    token0Param: xlm.address,
    token1Param: usdt.address,
    swapAmountString: '12',
    setAmount: vi.fn(),
    selectToken: vi.fn(),
    selectPair: vi.fn(),
    switchTokens: vi.fn(),
  }
  mocks.form.mockImplementation(() => form)
  mocks.search.mockReturnValue({ data: [], isLoading: false })
  mocks.catalogCurrency.mockReturnValue(undefined)
  mocks.catalog.mockReturnValue({
    getCurrency: mocks.catalogCurrency,
    isLoading: false,
  })
})

afterEach(() => act(() => root.unmount()))

function render(): void {
  act(() => {
    root.render(<StellarUnifiedSwapRuntime config={{ maintenance: false }} />)
  })
}

it('uses existing Stellar swap contracts with the selected tokens and amount', () => {
  render()
  expect(container.textContent).toBe(`${xlm.symbol}/${usdt.symbol}: 12`)
})

it('resolves a selected non-base Stellar token by exact address', () => {
  form.token1Param = custom.address
  mocks.search.mockReturnValue({ data: [usdt, custom], isLoading: false })
  render()
  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 12`)
})

it('resolves a catalog-only Stellar token on a same-chain pair', () => {
  form.token1Param = custom.address
  mocks.catalogCurrency.mockImplementation(
    (chainId: number, address: string | undefined) =>
      chainId === StellarChainId.STELLAR && address === custom.address
        ? custom
        : undefined,
  )
  render()
  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 12`)
})

it('does not substitute a different catalog token when API lookup fails', () => {
  form.token1Param = custom.address
  mocks.search.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
  })
  mocks.catalogCurrency.mockReturnValue(usdt)
  render()
  expect(container.textContent).toContain('Unable to load')
  expect(container.textContent).not.toContain(`${xlm.symbol}/${usdt.symbol}`)
})

it('removes the executable widget while the newly selected token is unresolved', () => {
  render()
  form = { ...form, token1Param: custom.address }
  mocks.search.mockReturnValue({ data: [usdt], isLoading: true })
  render()
  expect(container.textContent).toContain('Loading Stellar tokens')
  expect(container.querySelector('span')?.closest('[hidden]')).not.toBeNull()
  expect(container.querySelector('span')?.closest('[inert]')).not.toBeNull()
  expect(container.querySelectorAll('button')).toHaveLength(2)
})

it('does not replace an invalid selected address with a default token', () => {
  form.token0Param = 'invalid'
  render()
  expect(container.textContent).toContain('Unable to load')
  expect(container.textContent).not.toContain(`${xlm.symbol}/${usdt.symbol}`)
})

it('discards the previous pair quote without remounting pending execution state', () => {
  render()
  act(() => {
    quoteActions.setOutputAmount(42n)
    setWidgetPending(true)
  })
  expect(container.querySelector('span')?.dataset.output).toBe('42')

  form = { ...form, token1Param: custom.address }
  mocks.search.mockReturnValue({ data: [custom], isLoading: false })
  render()

  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 12`)
  expect(container.querySelector('span')?.dataset.output).toBe('0')
  expect(container.querySelector('span')?.dataset.pending).toBe('true')
})

it('preserves pending execution through delayed and failed metadata lookup', () => {
  render()
  act(() => {
    quoteActions.setOutputAmount(42n)
    setWidgetPending(true)
  })

  form = { ...form, token1Param: custom.address }
  mocks.search.mockReturnValue({ data: undefined, isLoading: true })
  render()
  expect(container.querySelector('span')?.closest('[hidden]')).not.toBeNull()
  expect(container.querySelector('span')?.dataset.pending).toBe('true')

  mocks.search.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
  })
  render()
  expect(container.textContent).toContain('Unable to load')
  expect(container.querySelector('span')?.closest('[inert]')).not.toBeNull()
  expect(container.querySelector('span')?.dataset.pending).toBe('true')

  mocks.search.mockReturnValue({ data: [custom], isLoading: false })
  render()
  expect(container.querySelector('span')?.closest('[hidden]')).toBeNull()
  expect(container.querySelector('span')?.dataset.pending).toBe('true')
  expect(container.querySelector('span')?.dataset.output).toBe('0')
  expect(container.textContent).toBe(`${xlm.symbol}/deHYB: 12`)
})
