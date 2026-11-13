/** @vitest-environment jsdom */

import {
  type ComponentType,
  type PropsWithChildren,
  Suspense,
  act,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { UnifiedSwapChainId } from 'src/lib/swap/unified-swap'
import {
  type UnifiedSwapState,
  useUnifiedSwap,
} from 'src/lib/swap/unified-swap-context'
import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { SvmChainId } from 'sushi/svm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { SwapEdgeConfig } from '../swap-edge-config'
import { UnifiedSwapRuntime } from './unified-swap-runtime'

const mocks = vi.hoisted(() => ({
  searchParams: new URLSearchParams(),
  evm: vi.fn(),
  svm: vi.fn(),
  stellar: vi.fn(),
  form: vi.fn(),
  lifi: vi.fn(),
  routing: vi.fn(),
  edge: vi.fn(),
  captureForm: vi.fn<(form: UnifiedSwapState | null) => void>(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/ethereum/swap',
  useSearchParams: () => mocks.searchParams,
}))
vi.mock('next/dynamic', async () => {
  const { lazy } = await import('react')
  return {
    default: (load: () => Promise<ComponentType<Record<string, unknown>>>) =>
      lazy(async () => ({ default: await load() })),
  }
})
vi.mock('@sushiswap/ui', () => ({
  Button: ({ children }: PropsWithChildren) => (
    <button type="button">{children}</button>
  ),
  Message: ({ children }: PropsWithChildren) => <p>{children}</p>,
}))
vi.mock('src/lib/wagmi/components/sanctioned-address-dialog', () => ({
  SanctionedAddressDialog: () => null,
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  CheckerProvider: ({ children }: PropsWithChildren) => children,
}))
vi.mock('~evm/_common/ui/balance-provider/balance-provider', () => ({
  BalanceProvider: ({ children }: PropsWithChildren) => children,
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/price-provider', () => ({
  PriceProvider: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/providers/edge-config-provider', () => ({
  EdgeProvider: ({
    config,
    children,
  }: PropsWithChildren<{ config: unknown }>) => {
    mocks.edge(config)
    return children
  },
}))
vi.mock('../../cross-chain-swap/_ui/unified-swap-execution-provider', () => ({
  UnifiedSwapExecutionProvider: ({ children }: PropsWithChildren) => {
    mocks.captureForm(useUnifiedSwap())
    return children
  },
}))
vi.mock('../../cross-chain-swap/_ui/xswap-form-provider', () => ({
  XSwapFormProvider: ({
    children,
    defaultChainId,
    unified,
  }: PropsWithChildren<{ defaultChainId: number; unified: boolean }>) => {
    mocks.form({ defaultChainId, unified })
    return <div data-cross-provider="form">{children}</div>
  },
}))
vi.mock('../../cross-chain-swap/_ui/lifi/xswap-provider', () => ({
  LifiXSwapProvider: ({ children }: PropsWithChildren) => {
    mocks.lifi()
    return <div data-cross-provider="lifi">{children}</div>
  },
}))
vi.mock('../../cross-chain-swap/_ui/xswap-routing-provider', () => ({
  XSwapRoutingProvider: ({ children }: PropsWithChildren) => {
    mocks.routing()
    return <div data-cross-provider="routing">{children}</div>
  },
}))
vi.mock('../../cross-chain-swap/_ui/cross-chain-swap-widget', () => ({
  CrossChainSwapWidget: () => <div data-runtime="cross-chain" />,
}))
vi.mock('./evm-simple-swap-runtime', () => ({
  EvmSimpleSwapRuntime: ({ chainId }: { chainId: number }) => {
    mocks.evm(chainId)
    return <div data-runtime="sushi" />
  },
}))
vi.mock('./svm-simple-swap-runtime', () => ({
  SvmSimpleSwapRuntime: ({ chainId }: { chainId: number }) => {
    mocks.svm(chainId)
    return <div data-runtime="jupiter" />
  },
}))
vi.mock('./stellar-unified-swap-runtime', () => ({
  StellarUnifiedSwapRuntime: ({ config }: { config: unknown }) => {
    mocks.stellar(config)
    return <div data-runtime="stellar" />
  },
}))
vi.mock('./simple-swap-widget-frame', () => ({
  SimpleSwapWidgetFrame: ({ children }: PropsWithChildren) => children,
}))
vi.mock('./unified-swap-token-selector', () => ({
  UnifiedSwapTokenSelector: ({
    children,
    side,
  }: PropsWithChildren<{ side: string }>) => (
    <div data-selector={side}>{children}</div>
  ),
}))

const swapConfig = { maintenance: false }
const crossChainConfig = { maintenance: true }
const readyCrossChainConfig = Promise.resolve(crossChainConfig)
let root: Root
let container: HTMLDivElement
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.clearAllMocks()
  mocks.searchParams = new URLSearchParams()
  window.history.replaceState(null, '', '/ethereum/swap')
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
})

async function renderPair(
  source: UnifiedSwapChainId,
  destination: UnifiedSwapChainId = source,
  defaultChainId: UnifiedSwapChainId = EvmChainId.ETHEREUM,
  crossChainConfigPromise: Promise<SwapEdgeConfig> = readyCrossChainConfig,
): Promise<void> {
  const params = new URLSearchParams({
    chainId0: String(source),
    chainId1: String(destination),
  })
  await renderParams(params, defaultChainId, crossChainConfigPromise)
}

async function renderParams(
  params: URLSearchParams,
  defaultChainId: UnifiedSwapChainId = EvmChainId.ETHEREUM,
  crossChainConfigPromise: Promise<SwapEdgeConfig> = readyCrossChainConfig,
): Promise<void> {
  window.history.replaceState(null, '', `/ethereum/swap?${params.toString()}`)
  mocks.searchParams = new URLSearchParams(window.location.search)
  await act(async () =>
    root.render(
      <Suspense fallback={<div data-swap-loading />}>
        <UnifiedSwapRuntime
          defaultChainId={defaultChainId}
          swapConfig={swapConfig}
          crossChainConfig={crossChainConfigPromise}
        />
      </Suspense>,
    ),
  )
  await act(async () => {
    await vi.dynamicImportSettled()
  })
}

function currentForm(): UnifiedSwapState {
  const form = mocks.captureForm.mock.lastCall?.[0]
  if (!form) throw new Error('Unified swap form was not mounted')
  return form
}

function pendingSwapParams(): URLSearchParams {
  return new URLSearchParams({
    chainId0: String(EvmChainId.ETHEREUM),
    chainId1: String(EvmChainId.BASE),
    token0: 'NATIVE',
    token1: '0x0000000000000000000000000000000000000001',
    swapAmount: '12',
  })
}

function expectOnlyRuntime(name: string): void {
  expect(
    Array.from(container.querySelectorAll('[data-runtime]'), (element) =>
      element.getAttribute('data-runtime'),
    ),
  ).toEqual([name])
}

function expectNoCrossChainProviders(): void {
  expect(mocks.form).not.toHaveBeenCalled()
  expect(mocks.lifi).not.toHaveBeenCalled()
  expect(mocks.routing).not.toHaveBeenCalled()
}

it('uses the Sushi EVM runtime for a same-chain selection independently of the page network', async () => {
  await renderPair(EvmChainId.BASE)
  expectOnlyRuntime('sushi')
  expect(mocks.evm).toHaveBeenCalledWith(EvmChainId.BASE)
  expect(mocks.edge).toHaveBeenCalledWith(swapConfig)
  expectNoCrossChainProviders()
})

it('uses the Jupiter Solana runtime for a same-chain Solana pair', async () => {
  await renderPair(SvmChainId.SOLANA)
  expectOnlyRuntime('jupiter')
  expect(mocks.svm).toHaveBeenCalledWith(SvmChainId.SOLANA)
  expectNoCrossChainProviders()
})

it('uses the Stellar contract runtime for a same-chain Stellar pair', async () => {
  await renderPair(StellarChainId.STELLAR)
  expectOnlyRuntime('stellar')
  expect(mocks.stellar).toHaveBeenCalledWith(swapConfig)
  expectNoCrossChainProviders()
})

it.each([EvmChainId.ETHEREUM, SvmChainId.SOLANA, StellarChainId.STELLAR])(
  'renders same-chain %s without waiting for cross-chain configuration',
  async (chainId) => {
    const config = Promise.withResolvers<SwapEdgeConfig>()
    await renderPair(chainId, chainId, EvmChainId.ETHEREUM, config.promise)

    expect(container.querySelector('[data-runtime]')).not.toBeNull()
    expect(container.querySelector('[data-swap-loading]')).toBeNull()
    expectNoCrossChainProviders()
  },
)

it('keeps cross-chain providers suspended until their configuration resolves', async () => {
  const config = Promise.withResolvers<SwapEdgeConfig>()
  await renderPair(
    EvmChainId.ETHEREUM,
    EvmChainId.BASE,
    EvmChainId.ETHEREUM,
    config.promise,
  )

  expect(container.querySelector('[data-swap-loading]')).not.toBeNull()
  expectNoCrossChainProviders()

  await act(async () => config.resolve(crossChainConfig))

  expectOnlyRuntime('cross-chain')
  expect(container.querySelector('[data-swap-loading]')).toBeNull()
  expect(mocks.edge).toHaveBeenCalledWith(crossChainConfig)
  expect(mocks.lifi).toHaveBeenCalledOnce()
  expect(mocks.routing).toHaveBeenCalledOnce()
})

it.each([
  [EvmChainId.ETHEREUM, EvmChainId.BASE],
  [SvmChainId.SOLANA, EvmChainId.ETHEREUM],
  [StellarChainId.STELLAR, EvmChainId.ETHEREUM],
] as const)(
  'uses existing cross-chain providers only for supported differing networks %s → %s',
  async (source, destination) => {
    await renderPair(source, destination)
    expectOnlyRuntime('cross-chain')
    expect(mocks.form).toHaveBeenCalledWith({
      defaultChainId: source,
      unified: true,
    })
    expect(mocks.lifi).toHaveBeenCalledOnce()
    expect(mocks.routing).toHaveBeenCalledOnce()
    expect(mocks.edge).toHaveBeenCalledWith(crossChainConfig)
    expect(mocks.evm).not.toHaveBeenCalled()
    expect(mocks.svm).not.toHaveBeenCalled()
    expect(mocks.stellar).not.toHaveBeenCalled()
  },
)

it('switches from same-chain to cross-chain and back on the mounted page', async () => {
  await renderPair(EvmChainId.ETHEREUM)
  expectOnlyRuntime('sushi')
  await renderPair(EvmChainId.ETHEREUM, EvmChainId.BASE)
  expectOnlyRuntime('cross-chain')
  await renderPair(SvmChainId.SOLANA)
  expectOnlyRuntime('jupiter')
  expect(container.querySelector('[data-cross-provider]')).toBeNull()
})

it.each(['2.5', ''])(
  'accepts a current amount callback setting amount to %j',
  async (amount) => {
    const params = pendingSwapParams()
    await renderParams(params)

    act(() => currentForm().setAmount(amount))

    const updated = new URLSearchParams(window.location.search)
    expect(updated.get('swapAmount')).toBe(amount || null)
    for (const key of ['chainId0', 'chainId1', 'token0', 'token1']) {
      expect(updated.get(key)).toBe(params.get(key))
    }
    expect(window.location.pathname).toBe('/ethereum/swap')
  },
)

it.each([
  ['chainId0', String(EvmChainId.BASE)],
  ['chainId1', String(EvmChainId.POLYGON)],
  ['token0', '0x0000000000000000000000000000000000000002'],
  ['token1', '0x0000000000000000000000000000000000000002'],
  ['swapAmount', '100'],
])(
  'ignores a pending completion callback after %s changes',
  async (key, value) => {
    const params = pendingSwapParams()
    await renderParams(params)
    const clearPendingAmount = currentForm().setAmount

    params.set(key, value)
    await renderParams(params)
    const currentUrl = window.location.href
    act(() => clearPendingAmount(''))

    expect(window.location.href).toBe(currentUrl)
    expect(new URLSearchParams(window.location.search).get(key)).toBe(value)
  },
)

it('ignores a pending completion callback after navigating to another pathname', async () => {
  const params = pendingSwapParams()
  await renderParams(params)
  const clearPendingAmount = currentForm().setAmount
  window.history.replaceState(null, '', `/solana/swap?${params.toString()}`)
  const currentUrl = window.location.href

  act(() => clearPendingAmount(''))

  expect(window.location.href).toBe(currentUrl)
  expect(new URLSearchParams(window.location.search).get('swapAmount')).toBe(
    '12',
  )
})

it('restores the effective source when history restores an earlier query on the original page', async () => {
  const earlierParams = new URLSearchParams({
    chainId0: String(EvmChainId.BASE),
    chainId1: String(EvmChainId.BASE),
  })
  await renderParams(earlierParams)
  expect(currentForm().chainId0).toBe(EvmChainId.BASE)
  await renderPair(SvmChainId.SOLANA)
  expectOnlyRuntime('jupiter')

  // Next's search-param subscription rerenders this same runtime after popstate.
  await renderParams(earlierParams)

  expect(currentForm().chainId0).toBe(EvmChainId.BASE)
  expect(currentForm().chainId1).toBe(EvmChainId.BASE)
  expect(mocks.evm).toHaveBeenLastCalledWith(EvmChainId.BASE)
  expectOnlyRuntime('sushi')
  expect(window.location.pathname).toBe('/ethereum/swap')
})
