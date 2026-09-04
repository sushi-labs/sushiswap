/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { getLayerZeroCurrency } from 'src/lib/swap/layerzero/tokens'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { Amount } from 'sushi'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DetailsInteractionTrackerProvider } from '../../../_ui/details-interaction-tracker-provider'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'
import { LayerZeroTradeDetails } from './trade-details'
import { LayerZeroTradeStats } from './trade-stats'

const { useXswap, useCurrencyPrice, useArrivalEstimate } = vi.hoisted(() => ({
  useXswap: vi.fn(),
  useCurrencyPrice: vi.fn(),
  useArrivalEstimate: vi.fn(),
}))
vi.mock('./xswap-provider', () => ({ useLayerZeroXSwap: useXswap }))
vi.mock('./hooks/use-layerzero-arrival-estimate', () => ({
  useLayerZeroArrivalEstimate: useArrivalEstimate,
}))
vi.mock(
  'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-currency-price',
  () => ({ useCurrencyPrice }),
)
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [{ toPercentString: () => '0.5%' }],
}))
vi.mock('@sushiswap/telemetry', () => ({
  BrowserEvent: {},
  InterfaceElementName: {},
  InterfaceEventName: {},
  TraceEvent: ({ children }: PropsWithChildren) => children,
}))
vi.mock('@sushiswap/ui', () => {
  function Block({ children }: PropsWithChildren) {
    return <div>{children}</div>
  }
  function Button({
    children,
    onClick,
    'aria-label': label,
    'aria-expanded': expanded,
  }: ComponentProps<'button'>) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={expanded}
      >
        {children}
      </button>
    )
  }
  return {
    Button,
    IconButton: ({ name, ...props }: ComponentProps<'button'>) => (
      <Button {...props} aria-label={name} />
    ),
    Collapsible: ({ open, children }: PropsWithChildren<{ open: boolean }>) =>
      open ? children : null,
    Explainer: () => null,
    SkeletonCircle: () => null,
    SkeletonText: () => null,
    SelectIcon: () => null,
    classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
    List: Object.assign(Block, {
      Control: Block,
      KeyValue: ({ title, children }: PropsWithChildren<{ title: string }>) => (
        <div>
          {title}: {children}
        </div>
      ),
    }),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const quote: LayerZeroQuote = {
  fromChainId: 1,
  toChainId: -4,
  sourceAddress: '0x000000000000000000000000000000000000dEaD',
  recipient: 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
  amountIn: 1_000_000n,
  amountSent: 1_000_000n,
  amountOut: 9_000_000n,
  minAmountOut: 8_955_000n,
  nativeFee: 1_000_000_000_000_000n,
  maxNativeFee: 1_100_000_000_000_000n,
  sendParam: {
    dstEid: 30600,
    to: '0x',
    amountLD: 1_000_000n,
    minAmountLD: 895_500n,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  },
}

describe('LayerZero trade UI', () => {
  let container: HTMLDivElement
  let root: Root

  function setQuote({
    data = quote,
    error,
    amount = 1_000_000n,
    isLoading = false,
    sourceNetworkFee = { status: 'estimated', amount: 500_000_000_000_000n },
  }: {
    data?: LayerZeroQuote | null
    error?: Error
    amount?: bigint
    isLoading?: boolean
    sourceNetworkFee?: LayerZeroSourceNetworkFee
  } = {}) {
    useXswap.mockReturnValue({
      state: {
        chainId0: 1,
        chainId1: -4,
        swapAmount: new Amount(getLayerZeroCurrency(1), amount),
      },
      previewQuote: { data, error, isLoading },
      sourceNetworkFee,
    })
  }

  function renderStats() {
    act(() =>
      root.render(
        <DetailsInteractionTrackerProvider>
          <LayerZeroTradeStats />
        </DetailsInteractionTrackerProvider>,
      ),
    )
  }

  function click(label: string) {
    const button = container.querySelector<HTMLButtonElement>(
      `button[aria-label="${label}"]`,
    )
    expect(button).not.toBeNull()
    act(() => button?.click())
  }

  beforeEach(() => {
    useArrivalEstimate.mockReturnValue({
      data: { estimatedSeconds: 1_020 },
      isLoading: false,
      isError: false,
    })
    useCurrencyPrice.mockReturnValue({
      data: 3_000,
      isLoading: false,
      isError: false,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    setQuote()
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.clearAllMocks()
  })

  it('starts collapsed and toggles the quote stats', () => {
    renderStats()
    expect(container.textContent).toContain('$1.50')
    expect(container.textContent).not.toMatch(/up to|~|ETH/i)
    expect(container.textContent).not.toContain('Est. received')
    click('Toggle Swap Details')
    expect(container.textContent).toContain('Est. received0.9 USDT0')
    expect(container.textContent).toContain('Min. received0.8955 USDT0')
    expect(container.textContent).toContain('Protocol fee0.1 USDT')
    expect(container.textContent).toContain('Network fee$1.50')
    expect(container.textContent).toContain('LayerZero fee 0.0011 ETH')
    expect(container.textContent).not.toMatch(/up to/i)
    expect(container.querySelector('a')?.href).toContain(quote.recipient)
    click('Toggle Swap Details')
    expect(container.textContent).not.toContain('Est. received')
  })

  it('inverts the displayed rate with the correct source and destination units', () => {
    renderStats()
    expect(container.textContent).toContain('1 USDT = 0.900000 USDT0')
    click('Invert exchange rate')
    expect(container.textContent).toContain('1 USDT0 = 1.111111 USDT')
  })

  it('resets expanded details after the input is cleared', () => {
    renderStats()
    click('Toggle Swap Details')
    setQuote({ amount: 0n })
    renderStats()
    expect(container.textContent).toBe('')
    setQuote()
    renderStats()
    expect(container.textContent).not.toContain('Est. received')
  })

  it('hides stale stats on a quote error', () => {
    setQuote({ error: new Error('Quote unavailable') })
    renderStats()
    expect(container.textContent).toBe('')
  })

  it('shows the existing loading treatment without an actionable dropdown', () => {
    setQuote({ data: null, isLoading: true })
    renderStats()
    expect(
      container.querySelector('[aria-label="Loading swap details"]'),
    ).not.toBeNull()
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders the LiFi-style route and recipient cards with expandable review details', () => {
    act(() =>
      root.render(
        <LayerZeroTradeDetails
          quote={quote}
          amounts={getLayerZeroTradeAmounts(quote)}
          sourceNetworkFee={{
            status: 'estimated',
            amount: 500_000_000_000_000n,
          }}
        />,
      ),
    )
    expect(container.textContent).toContain('LayerZero fee: 0.0011 ETH')
    expect(container.textContent).toContain('Estimated arrival: ~17 minutes')
    expect(useArrivalEstimate).toHaveBeenCalledWith(1, -4)
    expect(container.textContent).toContain('Send 1 USDT')
    expect(container.textContent).toContain('Receive 0.9 USDT0')
    expect(container.textContent).toContain('ETHEREUM')
    expect(container.textContent).toContain('STELLAR')
    expect(container.textContent).not.toContain('Min. received after slippage')
    click('Toggle review details')
    expect(container.textContent).toContain('Network fee: 0.0005 ETH ($1.50)')
    expect(container.querySelector('.text-muted-foreground')?.textContent).toBe(
      '($1.50)',
    )
    expect(container.textContent).not.toMatch(/up to/i)
    expect(container.textContent).toContain(
      'Min. received after slippage (0.5%): 0.8955 USDT0',
    )
    expect(container.textContent).toContain('Protocol fee: 0.1 USDT')
    expect(container.querySelector('a')?.href).toContain(quote.recipient)
  })

  it('does not render a recipient link for a disconnected preview', () => {
    const disconnectedQuote = { ...quote, recipient: undefined }
    act(() =>
      root.render(
        <LayerZeroTradeDetails
          quote={disconnectedQuote}
          amounts={getLayerZeroTradeAmounts(disconnectedQuote)}
          sourceNetworkFee={{ status: 'connect-wallet' }}
        />,
      ),
    )
    expect(container.querySelector('a')).toBeNull()
  })

  it('uses sent amounts, not Stellar dust, for protocol fees and route labels', () => {
    const amounts = getLayerZeroTradeAmounts({
      ...quote,
      fromChainId: -4,
      toChainId: 1,
      amountIn: 10_000_009n,
      amountSent: 10_000_000n,
      amountOut: 1_000_000n,
      minAmountOut: 995_000n,
      maxNativeFee: 1_100_000n,
    })
    expect(amounts.amountIn.toString()).toBe('1')
    expect(amounts.amountOut.toString()).toBe('1')
    expect(amounts.protocolFee.amount).toBe(0n)
    expect(amounts.messagingFee.toString()).toBe('0.11')
    expect(amounts.messagingFee.currency.symbol).toBe('XLM')
  })

  it.each([
    ['connect-wallet', 'Connect wallets to estimate'],
    ['approval-required', 'Available after USDT approval'],
    ['unavailable', 'Estimate unavailable'],
  ] as const)(
    'shows the %s gas state without inventing a fee',
    (status, text) => {
      setQuote({ sourceNetworkFee: { status } })
      renderStats()
      expect(container.textContent).toContain('N/A')
      expect(container.querySelector(`[title="${text}"]`)).not.toBeNull()
      click('Toggle Swap Details')
      expect(container.textContent).toContain('Network feeN/A')
      expect(container.textContent).not.toContain('$0.00')
    },
  )

  it('shows a gas skeleton while estimating', () => {
    setQuote({ sourceNetworkFee: { status: 'loading' } })
    renderStats()
    click('Toggle Swap Details')
    expect(
      container.querySelector('[aria-label="Estimating source network gas"]'),
    ).not.toBeNull()
    expect(container.textContent).not.toContain('~0')
  })

  it('shows simulated Stellar network fees in XLM, separately from messaging fees', () => {
    useCurrencyPrice.mockReturnValue({
      data: 0.25,
      isLoading: false,
      isError: false,
    })
    const stellarQuote: LayerZeroQuote = {
      ...quote,
      fromChainId: -4,
      toChainId: 1,
      sourceAddress: quote.recipient,
      recipient: quote.sourceAddress,
      amountIn: 10_000_000n,
      amountSent: 10_000_000n,
      amountOut: 1_000_000n,
      minAmountOut: 995_000n,
      maxNativeFee: 1_100_000n,
    }
    act(() =>
      root.render(
        <LayerZeroTradeDetails
          quote={stellarQuote}
          amounts={getLayerZeroTradeAmounts(stellarQuote)}
          sourceNetworkFee={{ status: 'estimated', amount: 123_456n }}
        />,
      ),
    )
    click('Toggle review details')
    expect(container.textContent).toContain('LayerZero fee: 0.11 XLM')
    expect(useArrivalEstimate).toHaveBeenCalledWith(-4, 1)
    expect(container.textContent).toContain('Network fee: 0.01 XLM ($0.003)')
  })

  it.each([
    { data: undefined, isLoading: false, isError: false },
    { data: 3_000, isLoading: false, isError: true },
    { data: 0, isLoading: false, isError: false },
  ])(
    'does not show a zero or stale USD fee without a valid price (%s)',
    (price) => {
      useCurrencyPrice.mockReturnValue(price)
      renderStats()
      expect(container.textContent).toContain('N/A')
      expect(container.textContent).not.toMatch(/\$|up to/i)
    },
  )

  it('keeps the native fee in the review when its USD price is unavailable', () => {
    useCurrencyPrice.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })
    act(() =>
      root.render(
        <LayerZeroTradeDetails
          quote={quote}
          amounts={getLayerZeroTradeAmounts(quote)}
          sourceNetworkFee={{
            status: 'estimated',
            amount: 500_000_000_000_000n,
          }}
        />,
      ),
    )
    click('Toggle review details')
    expect(container.textContent).toContain('Network fee: 0.0005 ETH (N/A)')
  })

  it('shows the LiFi-style USD skeleton while the gas price loads', () => {
    useCurrencyPrice.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })
    renderStats()
    expect(
      container.querySelector('[aria-label="Loading gas price"]'),
    ).not.toBeNull()
    expect(container.textContent).not.toMatch(/\$0.00|N\/A|up to/i)
  })

  it.each([
    [
      { data: { estimatedSeconds: null }, isError: false, isLoading: false },
      '~30 minutes',
    ],
    [
      { data: { estimatedSeconds: 1_020 }, isError: true, isLoading: false },
      '~30 minutes',
    ],
    [
      { data: { estimatedSeconds: 1_081 }, isError: false, isLoading: false },
      '~19 minutes',
    ],
    [
      { data: { estimatedSeconds: 45 }, isError: false, isLoading: false },
      '~1 minute',
    ],
  ])(
    'handles approximate and unavailable arrival times (%s)',
    (estimate, expected) => {
      useArrivalEstimate.mockReturnValue(estimate)
      act(() =>
        root.render(
          <LayerZeroTradeDetails
            quote={quote}
            amounts={getLayerZeroTradeAmounts(quote)}
            sourceNetworkFee={{ status: 'connect-wallet' }}
          />,
        ),
      )
      expect(container.textContent).toContain(`Estimated arrival: ${expected}`)
    },
  )

  it('shows a skeleton while the arrival estimate loads', () => {
    useArrivalEstimate.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })
    act(() =>
      root.render(
        <LayerZeroTradeDetails
          quote={quote}
          amounts={getLayerZeroTradeAmounts(quote)}
          sourceNetworkFee={{ status: 'connect-wallet' }}
        />,
      ),
    )
    expect(
      container.querySelector('[aria-label="Loading arrival estimate"]'),
    ).not.toBeNull()
    expect(container.textContent).not.toContain('~30 minutes')
  })

  it.each([
    [{ data: { estimatedSeconds: null }, isError: false }, '~30 minutes'],
    [{ data: undefined, isError: true }, '~30 minutes'],
    [{ data: { estimatedSeconds: 1_020 }, isError: true }, '~30 minutes'],
    [{ data: { estimatedSeconds: 1_885 }, isError: false }, '~32 minutes'],
  ])(
    'uses an approximate Stellar fallback only when timing is unavailable (%s)',
    (estimate, expected) => {
      useArrivalEstimate.mockReturnValue({ ...estimate, isLoading: false })
      const stellarQuote: LayerZeroQuote = {
        ...quote,
        fromChainId: -4,
        toChainId: 10,
        sourceAddress: quote.recipient,
        recipient: quote.sourceAddress,
        amountIn: 10_000_000n,
        amountSent: 10_000_000n,
        amountOut: 1_000_000n,
        minAmountOut: 995_000n,
        maxNativeFee: 1_100_000n,
      }
      act(() =>
        root.render(
          <LayerZeroTradeDetails
            quote={stellarQuote}
            amounts={getLayerZeroTradeAmounts(stellarQuote)}
            sourceNetworkFee={{ status: 'connect-wallet' }}
          />,
        ),
      )
      expect(container.textContent).toContain(`Estimated arrival: ${expected}`)
      expect(container.textContent).not.toContain('Unavailable')
    },
  )
})
