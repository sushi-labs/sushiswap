/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { valueTransferTestTrade } from 'src/lib/swap/value-transfer/trade-test-fixtures'
import {
  DialogType,
  useDialog,
} from 'src/lib/transaction-dialog/dialog-provider'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSharedLayerZeroExecutions } from './layerzero/execution-state-context'
import type { LayerZeroExecutionState } from './layerzero/hooks/use-layerzero-executions'
import { UnifiedSwapExecutionProvider } from './unified-swap-execution-provider'

const { useQueries, refetchChain } = vi.hoisted(() => ({
  useQueries: vi.fn(() => []),
  refetchChain: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({ useQueries }))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain }),
}))
vi.mock(
  'src/lib/transaction-dialog',
  async () => import('src/lib/transaction-dialog/dialog-provider'),
)
vi.mock('@sushiswap/ui', () => ({
  Button: ({ children, onClick }: { children: ReactNode; onClick(): void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))
vi.mock('./layerzero/execution-confirmation', () => ({
  LayerZeroExecutionConfirmation: ({
    execution,
  }: { execution?: { id: string; txHash?: string } }) => {
    const { open } = useDialog(DialogType.Confirm)
    return open ? (
      <div data-confirmation={execution?.id}>{execution?.txHash}</div>
    ) : null
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('unified swap execution lifetime', () => {
  let root: Root
  let container: HTMLDivElement
  let executionState: LayerZeroExecutionState

  function CrossChainRuntime(): null {
    const state = useSharedLayerZeroExecutions()
    if (!state) throw new Error('Missing shared execution state')
    executionState = state
    return null
  }

  function render(crossChain: boolean): void {
    act(() =>
      root.render(
        <UnifiedSwapExecutionProvider>
          {crossChain ? <CrossChainRuntime /> : <div>Same-chain swap</div>}
        </UnifiedSwapExecutionProvider>,
      ),
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('tracks a submission after the cross-chain runtime unmounts and remounts', () => {
    render(true)
    const mutation = executionState.mutate
    const quote = valueTransferTestTrade()
    act(() => {
      expect(mutation.beginExecution('pending-transfer', quote)).toBe(true)
    })

    render(false)
    act(() => {
      mutation.updateExecution('pending-transfer', {
        submitted: true,
        txHash: '0xsubmitted',
        sourceStatus: 'PENDING',
      })
      mutation.finishSubmission('pending-transfer')
    })

    expect(container.textContent).toContain('Same-chain swap')
    expect(container.textContent).toContain('Track Swap:')
    expect(useQueries).toHaveBeenLastCalledWith({
      queries: [
        expect.objectContaining({
          queryKey: [
            'value-transfer-status',
            quote.quote.id,
            '0xsubmitted',
            'pending-transfer',
          ],
          enabled: true,
        }),
      ],
    })
    act(() => container.querySelector('button')?.click())
    expect(
      container.querySelector('[data-confirmation="pending-transfer"]')
        ?.textContent,
    ).toBe('0xsubmitted')

    render(true)
    expect(executionState.executions).toHaveLength(1)
    expect(executionState.executions[0].id).toBe('pending-transfer')
    expect(executionState.isSubmitting).toBe(false)
    expect(mutation.beginExecution('duplicate-transfer', quote)).toBe(false)
  })
})
