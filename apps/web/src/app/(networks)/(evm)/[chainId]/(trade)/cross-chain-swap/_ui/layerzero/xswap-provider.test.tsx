/** @vitest-environment jsdom */
import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { valueTransferTestTrade } from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LayerZeroExecutionContext } from './execution-state-context'
import type { LayerZeroExecutionState } from './hooks/use-layerzero-executions'
import { LayerZeroXSwapProvider, useLayerZeroXSwap } from './xswap-provider'

const { useForm, useQuote, useCatalog, setSwapAmount, useLocalExecutions } =
  vi.hoisted(() => ({
    useForm: vi.fn(),
    useQuote: vi.fn(),
    useCatalog: vi.fn(),
    setSwapAmount: vi.fn(),
    useLocalExecutions: vi.fn(() => ({
      executions: [],
      isSubmitting: false,
      mutate: {},
    })),
  }))
vi.mock('../lifi/xswap-provider', () => ({
  useLifiXSwap: () => ({ state: {} }),
}))
vi.mock('../near-intents/xswap-provider', () => ({
  useNearIntentsXSwap: () => ({ state: {} }),
}))
vi.mock('../xswap-form-provider', () => ({ useXSwapForm: useForm }))
vi.mock('./hooks/use-value-transfer-quote', () => ({
  useValueTransferQuote: useQuote,
}))
vi.mock('./hooks/use-value-transfer-catalog', () => ({
  useValueTransferCatalog: useCatalog,
}))
vi.mock('./hooks/use-layerzero-executions', () => ({
  useLayerZeroExecutions: useLocalExecutions,
}))
vi.mock('./hooks/use-layerzero-source-network-fee', () => ({
  useLayerZeroSourceNetworkFee: () => ({ status: 'unavailable' }),
}))
vi.mock('wagmi', () => ({ usePublicClient: () => undefined }))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => undefined,
}))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [{ toNumber: () => 0.005 }],
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const trade = valueTransferTestTrade()

describe('Value Transfer provider', () => {
  let root: Root
  let container: HTMLDivElement
  let context: ReturnType<typeof useLayerZeroXSwap>
  function Harness(): ReactNode {
    context = useLayerZeroXSwap()
    return null
  }
  function render(enabled = true) {
    act(() =>
      root.render(
        <LayerZeroXSwapProvider enabled={enabled}>
          <Harness />
        </LayerZeroXSwapProvider>,
      ),
    )
  }
  beforeEach(() => {
    vi.clearAllMocks()
    useForm.mockReturnValue({
      chainId0: 1,
      chainId1: 42161,
      token0Param:
        trade.token0.type === 'token' ? trade.token0.address : 'NATIVE',
      token1Param:
        trade.token1.type === 'token' ? trade.token1.address : 'NATIVE',
      swapAmountString: '2',
      setSwapAmount,
    })
    useCatalog.mockReturnValue({
      getCurrency: (chainId: number) =>
        chainId === 1 ? trade.token0 : trade.token1,
      getToken: (chainId: number) => ({
        address:
          chainId === 1
            ? trade.quoteRequest.srcTokenAddress
            : trade.quoteRequest.dstTokenAddress,
      }),
      getChain: (chainId: number) =>
        chainId === 1 ? trade.srcChain : trade.dstChain,
    })
    useQuote.mockReturnValue({ data: trade })
    container = document.createElement('div')
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })
  it('waits for provider fallback authorization before enabling the quote', () => {
    render(false)
    expect(useQuote.mock.lastCall?.[0]).toMatchObject({
      enabled: false,
      amount: 2_000_000n,
      slippageBps: 50,
    })
    render(true)
    expect(useQuote.mock.lastCall?.[0].enabled).toBe(true)
  })
  it('uses discovered tokens without forcing either selection to USDT0', () => {
    render()
    expect(context.state.token0).toBe(trade.token0)
    expect(context.state.token1).toBe(trade.token1)
    expect(context.state.swapAmount?.amount).toBe(2_000_000n)
  })
  it('clears the amount only while it still belongs to the submitted trade', () => {
    render()
    context.mutate.clearSwapAmountIfUnchanged(trade)
    expect(setSwapAmount).toHaveBeenCalledWith('')
    setSwapAmount.mockClear()
    context.mutate.clearSwapAmountIfUnchanged({ ...trade, amountIn: 1n })
    expect(setSwapAmount).not.toHaveBeenCalled()
    render(false)
    context.mutate.clearSwapAmountIfUnchanged(trade)
    expect(setSwapAmount).not.toHaveBeenCalled()
  })
  it('has no amount to quote while token discovery is pending', () => {
    useCatalog.mockReturnValue({
      getCurrency: () => undefined,
      getToken: () => undefined,
      getChain: () => undefined,
    })
    render()
    expect(context.state.swapAmount).toBeUndefined()
    expect(useQuote.mock.lastCall?.[0].amount).toBeUndefined()
  })

  it('reuses shared executions without starting a second tracker', () => {
    const executionState: LayerZeroExecutionState = {
      executions: [],
      isSubmitting: true,
      mutate: {
        beginExecution: vi.fn(() => true),
        updateExecution: vi.fn(),
        failExecution: vi.fn(),
        finishSubmission: vi.fn(),
      },
    }
    act(() =>
      root.render(
        <LayerZeroExecutionContext.Provider value={executionState}>
          <LayerZeroXSwapProvider>
            <Harness />
          </LayerZeroXSwapProvider>
        </LayerZeroExecutionContext.Provider>,
      ),
    )
    expect(useLocalExecutions).not.toHaveBeenCalled()
    expect(context.state.executions).toBe(executionState.executions)
    expect(context.state.isSubmitting).toBe(true)
    expect(context.mutate.beginExecution).toBe(
      executionState.mutate.beginExecution,
    )
  })

  it('does not clear the next swap amount after its runtime unmounts', () => {
    render()
    const clearSwapAmount = context.mutate.clearSwapAmountIfUnchanged
    act(() => root.render(null))
    clearSwapAmount(trade)
    expect(setSwapAmount).not.toHaveBeenCalled()
  })
})
