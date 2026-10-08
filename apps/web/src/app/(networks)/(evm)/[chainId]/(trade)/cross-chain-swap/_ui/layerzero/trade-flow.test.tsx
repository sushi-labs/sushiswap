/** @vitest-environment jsdom */

import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
  act,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { ValueTransferTrade as LayerZeroQuote } from 'src/lib/swap/value-transfer/trade'
import { valueTransferTestTrade } from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { Amount } from 'sushi'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StepState } from '../lifi/confirmation-dialog'
import { getLayerZeroExecutionStepStates } from './execution-step-states'
import type { LayerZeroTrackedExecution } from './hooks/use-layerzero-executions'
import { LayerZeroTradeButton } from './trade-button'
import { LayerZeroTradeReviewDialog } from './trade-review-dialog'

const { useXswap, approve, useApproved, mutate, setOpen, confirm } = vi.hoisted(
  () => ({
    useXswap: vi.fn(),
    approve: vi.fn(),
    useApproved: vi.fn(),
    mutate: vi.fn(),
    setOpen: vi.fn(),
    confirm: vi.fn(),
  }),
)
vi.mock('./xswap-provider', () => ({ useLayerZeroXSwap: useXswap }))
vi.mock('../lifi/xswap-provider', () => ({
  useLifiXSwap: vi.fn(),
  useLifiXSwapSelectedTradeRoute: vi.fn(),
}))
vi.mock('./hooks/use-layerzero-execute', () => ({
  useLayerZeroExecute: () => ({ mutate }),
}))
vi.mock('./hooks/use-is-layerzero-xswap-maintenance', () => ({
  useIsLayerZeroXSwapMaintenance: () => ({ data: false }),
}))
vi.mock('./trade-details', () => ({
  LayerZeroTradeDetails: ({ quote }: { quote: LayerZeroQuote }) => (
    <div>Review amount: {quote.amountIn.toString()}</div>
  ),
}))
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({ useApproved }))
vi.mock('src/lib/wagmi/systems/checker/approve-erc20', () => ({
  ApproveERC20: (props: PropsWithChildren<{ enabled: boolean }>) => {
    approve(props)
    return props.children
  },
}))
vi.mock('src/lib/wagmi/systems/checker/amounts', () => ({
  Amounts: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/guard', () => ({
  Guard: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/network', () => ({
  Network: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/success', () => ({
  Success: ({ children }: PropsWithChildren) => children,
}))
vi.mock('~stellar/_common/ui/checker', () => ({
  Checker: { Trustline: ({ children }: PropsWithChildren) => children },
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => 'connected',
}))
vi.mock('src/lib/wallet/namespaces/namespace-for-chain-id', () => ({
  getNamespaceForChainId: () => 'evm',
}))
vi.mock('@sushiswap/ui/icons/check-mark-icon', () => ({
  CheckMarkIcon: () => null,
}))
vi.mock('@sushiswap/ui/icons/failed-mark-icon', () => ({
  FailedMarkIcon: () => null,
}))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogProvider: ({ children }: PropsWithChildren) => children,
  DialogReview: ({
    children,
  }: { children: (props: { confirm: () => void }) => ReactNode }) =>
    children({ confirm }),
  DialogType: { Confirm: 1 },
  useDialog: () => ({ setOpen }),
}))
vi.mock('@sushiswap/ui', () => {
  function Block({ children }: PropsWithChildren) {
    return <div>{children}</div>
  }
  function Button({
    children,
    asChild,
    testId,
    id,
    disabled,
    onClick,
  }: ComponentProps<'button'> & { asChild?: boolean; testId?: string }) {
    return asChild ? (
      children
    ) : (
      <button
        type="button"
        id={id}
        data-testid={testId}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
  return {
    Button,
    Dialog: Block,
    DialogContent: Block,
    DialogDescription: Block,
    DialogFooter: Block,
    DialogHeader: Block,
    DialogTitle: Block,
    DialogTrigger: Block,
    DialogClose: Block,
    Dots: Block,
    Message: Block,
    Loader: () => null,
    classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const quote = valueTransferTestTrade()
const earlier: LayerZeroTrackedExecution = {
  id: 'earlier',
  quote: { ...quote, amountIn: 1_000_000n, amountOut: 1_000_000n },
  txHash: '0xearlier',
  sourceStatus: 'SUCCESS',
  delivery: { status: 'PENDING', terminal: false },
  statusError: false,
}

describe('LayerZero approval and review flow', () => {
  let root: Root
  let container: HTMLDivElement

  function render({
    currentQuote = quote,
    executions = [],
    isSubmitting = false,
  }: {
    currentQuote?: LayerZeroQuote
    executions?: LayerZeroTrackedExecution[]
    isSubmitting?: boolean
  } = {}) {
    useXswap.mockReturnValue({
      state: {
        chainId0: currentQuote.fromChainId,
        chainId1: currentQuote.toChainId,
        token0: currentQuote.token0,
        token1: currentQuote.token1,
        swapAmount: new Amount(currentQuote.token0, currentQuote.amountIn),
        executions,
        isSubmitting,
      },
      previewQuote: { data: currentQuote },
      sourceNetworkFee: { status: 'loading' },
    })
    act(() =>
      root.render(
        <LayerZeroTradeReviewDialog>
          <LayerZeroTradeButton />
        </LayerZeroTradeReviewDialog>,
      ),
    )
  }

  function button(testId: string) {
    const element = container.querySelector<HTMLButtonElement>(
      `[data-testid="${testId}"]`,
    )
    if (!element) throw new Error(`Missing ${testId} button`)
    return element
  }

  function track() {
    const element = [...container.querySelectorAll('button')].find((item) =>
      item.textContent?.startsWith('Track Swap:'),
    )
    if (!element) throw new Error('Missing tracking button')
    act(() => element.click())
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useApproved.mockReturnValue({ approved: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('leaves route-specific approvals to the returned user steps', () => {
    render()
    expect(approve).not.toHaveBeenCalled()
    expect(button('swap').disabled).toBe(false)
  })

  it('blocks confirming an unapproved trade', () => {
    useApproved.mockReturnValue({ approved: false })
    render()
    expect(button('confirm-swap').disabled).toBe(true)
    act(() => button('confirm-swap').click())
    expect(mutate).not.toHaveBeenCalled()
  })

  it('allows reviewing and starting another swap while the prior transfer is bridging', () => {
    render({ executions: [earlier] })
    expect(container.textContent).toContain('Review amount: 2000000')
    expect(button('swap').disabled).toBe(false)
    expect(button('confirm-swap').disabled).toBe(false)
    act(() => button('confirm-swap').click())
    expect(confirm).toHaveBeenCalledOnce()
    expect(mutate).toHaveBeenCalledWith({ id: expect.any(String), quote })
    expect(mutate.mock.lastCall?.[0].id).not.toBe(earlier.id)
  })

  it('blocks only an active source submission', () => {
    render({ isSubmitting: true })
    expect(button('swap').disabled).toBe(true)
    expect(button('confirm-swap').disabled).toBe(true)
    act(() => button('confirm-swap').click())
    expect(mutate).not.toHaveBeenCalled()
  })

  it('reopens an earlier transfer and keeps its completion amount and explorer separate from the new quote', () => {
    render({ executions: [earlier] })
    track()
    expect(setOpen).toHaveBeenCalledWith(true)
    expect(container.textContent).toContain('Bridging')
    expect(
      container.querySelector(
        'a[href="https://layerzeroscan.com/tx/0xearlier"]',
      ),
    ).not.toBeNull()
    render({
      executions: [
        {
          ...earlier,
          delivery: {
            status: 'SUCCESS',
            terminal: true,
            destinationTxHash: 'destination-hash',
          },
        },
      ],
    })
    expect(container.textContent).toContain('Sent 1 USDC')
    expect(container.textContent).toContain('Review amount: 2000000')
    expect(container.textContent).toContain('Make another swap')
    expect(
      container.querySelector('a[href*="destination-hash"]'),
    ).not.toBeNull()
  })

  it('keeps uncertain transfers trackable without offering a failed-transfer retry', () => {
    render({
      executions: [
        { ...earlier, sourceStatus: 'PENDING', error: 'RPC timeout' },
      ],
    })
    track()
    expect(container.textContent).toContain('Do not resend this transfer')
    expect(container.querySelector('#swap-dialog-close')?.textContent).toBe(
      'Close',
    )
    expect(button('swap').disabled).toBe(false)
    render({
      executions: [
        {
          ...earlier,
          sourceStatus: 'PENDING',
          error: 'RPC timeout',
          delivery: {
            status: 'SUCCESS',
            terminal: true,
            destinationTxHash: 'destination-hash',
          },
        },
      ],
    })
    expect(container.textContent).toContain('Sent 1 USDC')
    expect(container.textContent).not.toContain('Do not resend this transfer')
  })

  it('tracks a submitted signature even before it has an on-chain hash', () => {
    render({
      executions: [
        {
          ...earlier,
          txHash: undefined,
          submitted: true,
          sourceStatus: 'PENDING',
        },
      ],
    })
    track()
    expect(setOpen).toHaveBeenCalledWith(true)
    expect(
      getLayerZeroExecutionStepStates({
        ...earlier,
        txHash: undefined,
        submitted: true,
        sourceStatus: 'PENDING',
      }).source,
    ).toBe(StepState.Pending)
  })

  it('shows bridge recovery separately from source failure', () => {
    render({
      executions: [
        { ...earlier, delivery: { status: 'ACTION_REQUIRED', terminal: true } },
      ],
    })
    track()
    expect(container.textContent).toContain(
      'Open the transfer explorer for recovery details',
    )
    expect(container.querySelector('#swap-dialog-close')?.textContent).toBe(
      'Close',
    )
    expect(
      getLayerZeroExecutionStepStates({ ...earlier, sourceStatus: 'FAILED' })
        .source,
    ).toBe(StepState.Failed)
    expect(getLayerZeroExecutionStepStates(undefined, true).source).toBe(
      StepState.Failed,
    )
  })
})
