/** @vitest-environment jsdom */
import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { valueTransferTestTrade } from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LayerZeroXSwapProvider, useLayerZeroXSwap } from './xswap-provider'

const { useForm, useQuote, useCatalog, setSwapAmount } = vi.hoisted(() => ({
  useForm: vi.fn(),
  useQuote: vi.fn(),
  useCatalog: vi.fn(),
  setSwapAmount: vi.fn(),
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
  useLayerZeroExecutions: () => ({
    executions: [],
    isSubmitting: false,
    mutate: {},
  }),
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
})
