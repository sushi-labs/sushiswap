/** @vitest-environment jsdom */

import { type PropsWithChildren, type ReactElement, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  UnifiedSwapContext,
  type UnifiedSwapState,
} from 'src/lib/swap/unified-swap-context'
import type { TokenSelectorChainId } from 'src/lib/wagmi/components/token-selector/config'
import type { TokenSelectorSelection } from 'src/lib/wagmi/components/token-selector/selection'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { ChainId } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  type WidgetMode,
  XSwapRoutingContext,
  XSwapRoutingLockContext,
} from '../../cross-chain-swap/_ui/xswap-routing-context'
import { UnifiedSwapTokenSelector } from './unified-swap-token-selector'

const mocks = vi.hoisted(() => ({
  isMd: true,
  selectToken: vi.fn(),
  selectPair: vi.fn(),
  setAmount: vi.fn(),
  switchTokens: vi.fn(),
  selection: vi.fn(),
  pair: vi.fn(),
  networks: vi.fn(),
  catalog: vi.fn(),
  lock: vi.fn<(provider: WidgetMode | undefined) => void>(),
}))

vi.mock('@sushiswap/hooks', () => ({
  useBreakpoint: () => ({ isMd: mocks.isMd }),
  useDebounce: (value: string) => value,
}))
vi.mock('@sushiswap/telemetry', () => ({
  InterfaceEventName: { TOKEN_SELECTOR_OPENED: 'token-selector-opened' },
  InterfaceModalName: { TOKEN_SELECTOR: 'token-selector' },
  Trace: ({ children }: PropsWithChildren) => children,
}))
vi.mock(
  'src/lib/wagmi/components/token-selector/desktop-network-selector',
  () => ({
    DesktopNetworkSelector: ({
      onSelect,
    }: { onSelect(network: number): void }) => (
      <div data-network-layout="desktop">
        <button type="button" onClick={() => onSelect(EvmChainId.BASE)}>
          Browse Base
        </button>
      </div>
    ),
  }),
)
vi.mock(
  'src/lib/wagmi/components/token-selector/mobile-network-selector',
  () => ({
    MobileNetworkSelector: () => <div data-network-layout="mobile" />,
  }),
)

vi.mock('@sushiswap/ui', async () => {
  const { cloneElement, createContext, useContext } = await import('react')
  const DialogContext = createContext({
    open: false,
    onOpenChange: (_open: boolean) => {},
  })

  return {
    classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
    gtagEvent: vi.fn(),
    PerpsDialogContent: ({ children }: PropsWithChildren) => children,
    Dialog: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{
      open: boolean
      onOpenChange(open: boolean): void
    }>) => (
      <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
      </DialogContext.Provider>
    ),
    DialogTrigger: ({
      children,
    }: { children: ReactElement<{ onClick(): void }> }) => {
      const dialog = useContext(DialogContext)
      return cloneElement(children, {
        onClick: () => dialog.onOpenChange(true),
      })
    },
    DialogContent: ({ children }: PropsWithChildren) => {
      const dialog = useContext(DialogContext)
      return dialog.open ? (
        <div role="dialog">
          <button type="button" onClick={() => dialog.onOpenChange(false)}>
            Close selector
          </button>
          {children}
        </div>
      ) : null
    },
    DialogHeader: ({ children }: PropsWithChildren) => children,
    DialogTitle: ({ children }: PropsWithChildren) => <h2>{children}</h2>,
    DialogDescription: ({ children }: PropsWithChildren) => <p>{children}</p>,
    TextField: ({
      value,
      onValueChange,
    }: { value: string; onValueChange(value: string): void }) => (
      <input
        aria-label="Search tokens"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    ),
  }
})
vi.mock('src/lib/wagmi/components/token-selector/network-selector-bar', () => ({
  NetworkSelectorBar: ({
    networks,
    selectedNetwork,
    onSelect,
  }: {
    networks: readonly number[]
    selectedNetwork: number
    onSelect(network: number): void
  }) => {
    mocks.networks(networks)
    return (
      <div data-network-layout="bar" data-selected-network={selectedNetwork}>
        {networks.map((network) => (
          <button
            key={network}
            type="button"
            aria-label={`Network ${network}`}
            aria-pressed={network === selectedNetwork}
            onClick={() => onSelect(network)}
          >
            {network}
          </button>
        ))}
      </div>
    )
  },
}))
vi.mock(
  'src/lib/wagmi/components/token-selector/token-selector-states',
  () => ({
    TokenSelectorStates: ({
      chainId,
      selected,
      search,
      onSelect,
    }: {
      chainId: TokenSelectorChainId
      selected?: CurrencyFor<TokenSelectorChainId>
      search: string
      onSelect(
        selection: TokenSelectorSelection<TokenSelectorChainId, true>,
      ): void
    }) => (
      <div
        data-token-list-chain={chainId}
        data-selected-token={selected?.id}
        data-query={search}
      >
        <button type="button" onClick={() => onSelect(mocks.selection())}>
          Pick token
        </button>
        <button type="button" onClick={() => onSelect(mocks.pair())}>
          Pick pool pair
        </button>
      </div>
    ),
  }),
)
vi.mock(
  'src/lib/wagmi/components/token-selector/additional-currencies-provider',
  () => ({
    AdditionalCurrenciesProvider: ({ children }: PropsWithChildren) => children,
  }),
)
vi.mock('src/lib/wagmi/components/token-selector/currency-info', () => ({
  CurrencyInfo: () => null,
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => undefined,
}))
vi.mock(
  '../../cross-chain-swap/_ui/layerzero/hooks/use-value-transfer-catalog',
  () => ({
    useValueTransferCatalog: (enabled: boolean) => {
      mocks.catalog(enabled)
      return { entries: [] }
    },
  }),
)

const baseToken = new EvmToken({
  chainId: EvmChainId.BASE,
  address: '0x0000000000000000000000000000000000000001',
  symbol: 'BASE1',
  name: 'Base token one',
  decimals: 18,
})
const baseToken2 = new EvmToken({
  chainId: EvmChainId.BASE,
  address: '0x0000000000000000000000000000000000000002',
  symbol: 'BASE2',
  name: 'Base token two',
  decimals: 6,
})
const ethereumToken = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  symbol: 'ETH1',
  name: 'Ethereum token one',
  decimals: 18,
})
let root: Root
let container: HTMLDivElement
let form: UnifiedSwapState
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.clearAllMocks()
  mocks.isMd = true
  mocks.selection.mockReturnValue(baseToken)
  mocks.pair.mockReturnValue([baseToken, baseToken2])
  form = {
    chainId0: EvmChainId.ETHEREUM,
    chainId1: EvmChainId.BASE,
    token0Param: ethereumToken.address,
    token1Param: baseToken.address,
    swapAmountString: '4.2',
    selectToken: mocks.selectToken,
    selectPair: mocks.selectPair,
    setAmount: mocks.setAmount,
    switchTokens: mocks.switchTokens,
  }
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function renderSelector(
  side: 'INPUT' | 'OUTPUT' = 'INPUT',
  routingMode: WidgetMode = 'lifi',
): void {
  act(() =>
    root.render(
      <UnifiedSwapContext.Provider value={form}>
        <XSwapRoutingContext.Provider value={routingMode}>
          <XSwapRoutingLockContext.Provider value={mocks.lock}>
            <UnifiedSwapTokenSelector
              side={side}
              currency={side === 'INPUT' ? ethereumToken : baseToken}
            >
              <button type="button">Open selector</button>
            </UnifiedSwapTokenSelector>
          </XSwapRoutingLockContext.Provider>
        </XSwapRoutingContext.Provider>
      </UnifiedSwapContext.Provider>,
    ),
  )
}

function clickButton(label: string): void {
  const button = Array.from(container.querySelectorAll('button')).find(
    (button) =>
      button.getAttribute('aria-label') === label ||
      button.textContent === label,
  )
  expect(button).toBeDefined()
  act(() => button?.click())
}

function expectListChain(chainId: number): void {
  expect(
    container
      .querySelector('[data-token-list-chain]')
      ?.getAttribute('data-token-list-chain'),
  ).toBe(String(chainId))
  expect(
    container
      .querySelector('[data-selected-network]')
      ?.getAttribute('data-selected-network'),
  ).toBe(String(chainId))
}

function expectUnchangedForm(): void {
  expect(mocks.selectToken).not.toHaveBeenCalled()
  expect(mocks.selectPair).not.toHaveBeenCalled()
  expect(mocks.setAmount).not.toHaveBeenCalled()
  expect(mocks.switchTokens).not.toHaveBeenCalled()
  expect(form.chainId0).toBe(EvmChainId.ETHEREUM)
  expect(form.chainId1).toBe(EvmChainId.BASE)
  expect(form.swapAmountString).toBe('4.2')
}

it.each([
  ['INPUT', EvmChainId.ETHEREUM],
  ['OUTPUT', EvmChainId.BASE],
] as const)('opens %s on its active network', (side, chainId) => {
  renderSelector(side)
  clickButton('Open selector')
  expectListChain(chainId)
  expectUnchangedForm()
})

it('enables catalog loading only while the selector is open', () => {
  renderSelector()
  expect(mocks.catalog).toHaveBeenLastCalledWith(false)

  clickButton('Open selector')
  expect(mocks.catalog).toHaveBeenLastCalledWith(true)

  clickButton('Close selector')
  expect(mocks.catalog).toHaveBeenLastCalledWith(false)
})

it('loads the browsed network without committing it to the swap form', () => {
  renderSelector()
  clickButton('Open selector')
  expectListChain(EvmChainId.ETHEREUM)
  expect(
    container
      .querySelector('[data-selected-token]')
      ?.getAttribute('data-selected-token'),
  ).toBe(ethereumToken.id)
  clickButton(`Network ${EvmChainId.BASE}`)
  expectListChain(EvmChainId.BASE)
  expect(
    container
      .querySelector('[data-token-list-chain]')
      ?.hasAttribute('data-selected-token'),
  ).toBe(false)
  expectUnchangedForm()
})

it('discards browsing on cancel and restores the active side when reopened', () => {
  renderSelector('OUTPUT')
  clickButton('Open selector')
  clickButton(`Network ${EvmChainId.ETHEREUM}`)
  expectListChain(EvmChainId.ETHEREUM)
  clickButton('Close selector')
  expect(container.querySelector('[role="dialog"]')).toBeNull()
  clickButton('Open selector')
  expectListChain(EvmChainId.BASE)
  expectUnchangedForm()
})

it('commits a foreign token and its chain only when the token is selected', () => {
  renderSelector()
  clickButton('Open selector')
  clickButton(`Network ${EvmChainId.BASE}`)
  expectUnchangedForm()
  clickButton('Pick token')
  expect(mocks.selectToken).toHaveBeenCalledOnce()
  expect(mocks.selectToken).toHaveBeenCalledWith(
    'INPUT',
    EvmChainId.BASE,
    baseToken.address,
  )
  expect(mocks.selectPair).not.toHaveBeenCalled()
  expect(container.querySelector('[role="dialog"]')).toBeNull()
})

it('preserves the native token parameter when selecting a network native currency', () => {
  mocks.selection.mockReturnValue(EvmNative.fromChainId(EvmChainId.BASE))
  renderSelector('OUTPUT')
  clickButton('Open selector')
  clickButton('Pick token')
  expect(mocks.selectToken).toHaveBeenCalledOnce()
  expect(mocks.selectToken).toHaveBeenCalledWith(
    'OUTPUT',
    EvmChainId.BASE,
    'NATIVE',
  )
})

it('commits both tokens on the browsed network when selecting a pool pair', () => {
  renderSelector()
  clickButton('Open selector')
  clickButton(`Network ${EvmChainId.BASE}`)
  clickButton('Pick pool pair')
  expect(mocks.selectPair).toHaveBeenCalledOnce()
  expect(mocks.selectPair).toHaveBeenCalledWith(
    EvmChainId.BASE,
    baseToken.address,
    baseToken2.address,
  )
  expect(mocks.selectToken).not.toHaveBeenCalled()
  expect(container.querySelector('[role="dialog"]')).toBeNull()
})

it('excludes Aptos from the unified network selector', () => {
  renderSelector()
  clickButton('Open selector')
  expect(mocks.networks).toHaveBeenCalled()
  expect(mocks.networks.mock.lastCall?.[0]).not.toContain(ChainId.APTOS)
})

it.each([
  [true, 'desktop'],
  [false, 'mobile'],
] as const)(
  'keeps the existing %s breakpoint selector without opting into the network bar',
  (isMd, layout) => {
    mocks.isMd = isMd
    act(() =>
      root.render(
        <TokenSelector
          chainId={EvmChainId.ETHEREUM}
          selected={ethereumToken}
          networks={[EvmChainId.ETHEREUM, EvmChainId.BASE]}
          selectedNetwork={EvmChainId.ETHEREUM}
          onNetworkSelect={vi.fn()}
        >
          <button type="button">Open selector</button>
        </TokenSelector>,
      ),
    )
    clickButton('Open selector')
    expect(
      container
        .querySelector('[data-network-layout]')
        ?.getAttribute('data-network-layout'),
    ).toBe(layout)
    expect(container.querySelector('[data-network-layout="bar"]')).toBeNull()
  },
)

it('opts only the unified selector into the network bar', () => {
  renderSelector()
  clickButton('Open selector')
  expect(
    container
      .querySelector('[data-network-layout]')
      ?.getAttribute('data-network-layout'),
  ).toBe('bar')
})

it.each([
  ['sidebar', 'USDC', 'Browse Base'],
  ['bar', '', `Network ${EvmChainId.BASE}`],
] as const)(
  'preserves the expected search behavior for the %s layout',
  (layout, expectedQuery, networkButton) => {
    act(() =>
      root.render(
        <TokenSelector
          chainId={EvmChainId.ETHEREUM}
          selected={ethereumToken}
          networks={[EvmChainId.ETHEREUM, EvmChainId.BASE]}
          selectedNetwork={EvmChainId.ETHEREUM}
          onNetworkSelect={vi.fn()}
          networkSelectorLayout={layout}
        >
          <button type="button">Open selector</button>
        </TokenSelector>,
      ),
    )
    clickButton('Open selector')
    const input = container.querySelector('input')
    if (!input) throw new Error('Search field was not mounted')
    act(() => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set?.call(input, 'USDC')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    expect(input.value).toBe('USDC')
    expect(
      container.querySelector('[data-query]')?.getAttribute('data-query'),
    ).toBe('USDC')

    clickButton(networkButton)

    expect(input.value).toBe(expectedQuery)
  },
)

it.each(['lifi', 'near-intents', 'layerzero'] as const)(
  'locks the current %s provider only while the token selector is open',
  (routingMode) => {
    renderSelector('INPUT', routingMode)
    expect(mocks.lock).not.toHaveBeenCalled()

    clickButton('Open selector')
    expect(mocks.lock.mock.calls).toEqual([[routingMode]])
    clickButton(`Network ${EvmChainId.BASE}`)
    expect(mocks.lock.mock.calls).toEqual([[routingMode]])
    expectListChain(EvmChainId.BASE)

    clickButton('Close selector')
    expect(mocks.lock.mock.calls).toEqual([[routingMode], [undefined]])
  },
)

it.each(['Pick token', 'Pick pool pair'])(
  'releases the provider lock when %s closes the selector',
  (action) => {
    renderSelector()
    clickButton('Open selector')
    clickButton(action)
    expect(mocks.lock.mock.calls).toEqual([['lifi'], [undefined]])
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  },
)

it('releases the provider lock when an open selector unmounts', () => {
  renderSelector()
  clickButton('Open selector')
  expect(mocks.lock.mock.calls).toEqual([['lifi']])

  act(() => root.render(null))

  expect(mocks.lock.mock.calls).toEqual([['lifi'], [undefined]])
})
