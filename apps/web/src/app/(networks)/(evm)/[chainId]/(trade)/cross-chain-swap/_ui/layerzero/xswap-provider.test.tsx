/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  type LayerZeroChainId,
  getLayerZeroTokenAddress,
} from 'src/lib/swap/layerzero/config'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { XSwapFormState } from '../xswap-form-provider'
import { LayerZeroXSwapProvider, useLayerZeroXSwap } from './xswap-provider'

const { useForm, usePublicClient, fetchQuote } = vi.hoisted(() => ({
  useForm: vi.fn(),
  usePublicClient: vi.fn(),
  fetchQuote: vi.fn(),
}))
vi.mock('../xswap-form-provider', () => ({ useXSwapForm: useForm }))
vi.mock('wagmi', () => ({ usePublicClient }))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => undefined,
}))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [{ toNumber: () => 0.005 }],
}))
vi.mock('src/lib/swap/layerzero/quote', () => ({
  fetchLayerZeroQuote: fetchQuote,
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

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const quote: LayerZeroQuote = {
  fromChainId: -4,
  toChainId: 1,
  sourceAddress: undefined,
  recipient: undefined,
  amountIn: 10_000_000n,
  amountSent: 10_000_000n,
  amountOut: 1_000_000n,
  minAmountOut: 995_000n,
  nativeFee: 1_000n,
  maxNativeFee: 1_100n,
  sendParam: {
    dstEid: 30101,
    to: '0x',
    amountLD: 10_000_000n,
    minAmountLD: 9_950_000n,
    extraOptions: '0x',
    composeMsg: '0x',
    oftCmd: '0x',
  },
}

describe('LayerZero quote initialization', () => {
  let root: Root
  let container: HTMLDivElement
  let client: QueryClient
  let value: ReturnType<typeof useLayerZeroXSwap>
  const setTokenParams = vi.fn()
  const setChainId1 = vi.fn()

  function Harness() {
    value = useLayerZeroXSwap()
    return null
  }

  async function render(
    amount = '1',
    fromChainId: LayerZeroChainId = -4,
    toChainId: LayerZeroChainId = 1,
  ) {
    await renderForm({
      chainId0: fromChainId,
      chainId1: toChainId,
      token0Param: getLayerZeroTokenAddress(fromChainId),
      token1Param: getLayerZeroTokenAddress(toChainId),
      swapAmountString: amount,
    })
  }

  async function renderForm(
    form: Pick<
      XSwapFormState,
      | 'chainId0'
      | 'chainId1'
      | 'token0Param'
      | 'token1Param'
      | 'swapAmountString'
    >,
  ) {
    useForm.mockReturnValue({ ...form, setTokenParams, setChainId1 })
    await act(async () =>
      root.render(
        <QueryClientProvider client={client}>
          <LayerZeroXSwapProvider>
            <Harness />
          </LayerZeroXSwapProvider>
        </QueryClientProvider>,
      ),
    )
    await advance(1)
  }

  async function advance(ms: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms)
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.resetAllMocks()
    fetchQuote.mockResolvedValue(quote)
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    notifyManager.setNotifyFunction((callback) => callback())
    vi.useRealTimers()
  })

  it('recovers an initial Stellar RPC failure without re-entering the amount', async () => {
    fetchQuote.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await render()
    expect(fetchQuote).toHaveBeenCalledOnce()
    expect(value.previewQuote.isLoading).toBe(true)
    expect(value.previewQuote.error).toBeNull()
    await advance(1_001)
    expect(fetchQuote).toHaveBeenCalledTimes(2)
    expect(value.previewQuote.data).toEqual(quote)
    expect(value.previewQuote.error).toBeNull()
  })

  it('bounds retries and still exposes a persistent error', async () => {
    fetchQuote.mockRejectedValue(new Error('RPC unavailable'))
    await render()
    await advance(3_001)
    expect(fetchQuote).toHaveBeenCalledTimes(3)
    expect(value.previewQuote.error?.message).toBe('RPC unavailable')
    expect(value.previewQuote.isFetching).toBe(false)
  })

  it('does not publish a quote for an older amount when inputs change during a request', async () => {
    let finishOld: ((result: LayerZeroQuote) => void) | undefined
    fetchQuote.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishOld = resolve
        }),
    )
    await render('1')
    const next = { ...quote, amountIn: 20_000_000n, amountOut: 2_000_000n }
    fetchQuote.mockResolvedValue(next)
    await render('2')
    expect(value.previewQuote.data).toEqual(next)
    await act(async () => {
      finishOld?.(quote)
    })
    await advance(1)
    expect(value.previewQuote.data).toEqual(next)
  })

  it('waits for the EVM source client and starts automatically when it becomes ready', async () => {
    await render('1', 1, -4)
    expect(fetchQuote).not.toHaveBeenCalled()
    expect(value.previewQuote.isError).toBe(false)
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    })
    usePublicClient.mockReturnValue(publicClient)
    await render('1', 1, -4)
    expect(fetchQuote).toHaveBeenCalledOnce()
    expect(fetchQuote).toHaveBeenCalledWith(
      expect.objectContaining({ publicClient, fromChainId: 1 }),
    )
  })

  it('does not request or retry quotes for an empty amount', async () => {
    await render('')
    await advance(5_000)
    expect(fetchQuote).not.toHaveBeenCalled()
  })

  it('leaves a destination outside LayerZero to the other provider', async () => {
    await renderForm({
      chainId0: -4,
      chainId1: 8453,
      token0Param: getLayerZeroTokenAddress(-4),
      token1Param: undefined,
      swapAmountString: '1',
    })
    await advance(30_001)
    expect(fetchQuote).not.toHaveBeenCalled()
    expect(setTokenParams).not.toHaveBeenCalled()
    expect(setChainId1).not.toHaveBeenCalled()
  })

  it.each([
    {
      chainId0: -4,
      chainId1: 1,
      token0Param: getLayerZeroTokenAddress(-4),
      token1Param: 'NATIVE',
    },
    {
      chainId0: 1,
      chainId1: -4,
      token0Param: 'NATIVE',
      token1Param: getLayerZeroTokenAddress(-4),
    },
  ] as const)(
    'does not overwrite another token selected on $chainId0 → $chainId1',
    async (form) => {
      await renderForm({ ...form, swapAmountString: '1' })
      expect(fetchQuote).not.toHaveBeenCalled()
      expect(setTokenParams).not.toHaveBeenCalled()
    },
  )

  it('automatically resolves USDT0 after selecting a supported destination', async () => {
    await renderForm({
      chainId0: -4,
      chainId1: 42161,
      token0Param: getLayerZeroTokenAddress(-4),
      token1Param: undefined,
      swapAmountString: '1',
    })
    expect(setTokenParams).toHaveBeenCalledWith(
      getLayerZeroTokenAddress(-4),
      getLayerZeroTokenAddress(42161),
    )
    expect(fetchQuote).toHaveBeenCalledWith(
      expect.objectContaining({ fromChainId: -4, toChainId: 42161 }),
    )
  })

  it('still initializes the default destination when none is selected', async () => {
    await renderForm({
      chainId0: -4,
      chainId1: undefined,
      token0Param: getLayerZeroTokenAddress(-4),
      token1Param: undefined,
      swapAmountString: '',
    })
    expect(setChainId1).toHaveBeenCalledWith(1)
  })
})
