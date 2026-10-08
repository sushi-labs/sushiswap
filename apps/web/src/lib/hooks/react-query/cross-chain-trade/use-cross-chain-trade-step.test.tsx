/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { warningSeverity } from 'src/lib/swap/warning-severity'
import { Fraction } from 'sushi'
import { EvmChainId, EvmNative } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Step } from '~evm/api/cross-chain/schemas'
import { useCrossChainTradeStep } from './use-cross-chain-trade-step'

const { usePricesMock } = vi.hoisted(() => ({ usePricesMock: vi.fn() }))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: usePricesMock,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const sourceChainId = EvmChainId.HYPEREVM
const destinationChainId = EvmChainId.ROBINHOOD
const destinationToken = '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856'
const step = {
  id: 'hype-bridge-step',
  type: 'cross',
  tool: 'relay',
  toolDetails: { key: 'relay', name: 'Relay', logoURI: '' },
  action: {
    fromChainId: sourceChainId,
    toChainId: destinationChainId,
    fromAmount: '110000000000000000',
    fromToken: {
      address: zeroAddress,
      chainId: sourceChainId,
      decimals: 18,
      symbol: 'HYPE',
      name: 'HYPE',
      priceUSD: '88.18',
    },
    toToken: {
      address: destinationToken,
      chainId: destinationChainId,
      decimals: 18,
      symbol: 'HYPE',
      name: 'HYPE',
      // The malformed aggregator price that produced the reported warning.
      priceUSD: '0.0000000001',
    },
    slippage: 0.005,
  },
  estimate: {
    tool: 'relay',
    fromAmount: '110000000000000000',
    fromAmountUSD: '9.6998',
    toAmount: '106210478000000000',
    toAmountMin: '105679425610000000',
    toAmountUSD: '0.0001',
    approvalAddress: '0x1111111111111111111111111111111111111111',
    feeCosts: [],
    gasCosts: [],
    executionDuration: 30,
  },
  includedSteps: [],
  transactionRequest: {
    to: '0x2222222222222222222222222222222222222222',
    data: '0x1234',
    value: '110000000000000000',
  },
} satisfies Step<typeof sourceChainId, typeof destinationChainId, 'lifi'>

type StepQuery = ReturnType<
  typeof useCrossChainTradeStep<typeof sourceChainId, typeof destinationChainId>
>

describe('cross-chain executable step price impact', () => {
  let client: QueryClient
  let root: Root
  let container: HTMLDivElement
  let query: StepQuery | undefined
  let destinationPrices: { getFraction: () => Fraction | undefined }
  const sourcePrices = {
    getFraction: vi.fn(
      () => new Fraction({ numerator: 8818, denominator: 100 }),
    ),
  }
  const fetchStep = vi.fn<typeof fetch>()

  function Harness() {
    query = useCrossChainTradeStep({ step })
    return null
  }

  async function render() {
    await act(async () =>
      root.render(
        <QueryClientProvider client={client}>
          <Harness />
        </QueryClientProvider>,
      ),
    )
  }

  beforeEach(() => {
    query = undefined
    destinationPrices = {
      getFraction: vi.fn(
        () => new Fraction({ numerator: 8818, denominator: 100 }),
      ),
    }
    sourcePrices.getFraction.mockClear()
    usePricesMock.mockReset().mockImplementation(({ chainId }) => ({
      data: chainId === sourceChainId ? sourcePrices : destinationPrices,
    }))
    fetchStep.mockReset().mockImplementation(async () => Response.json(step))
    vi.stubGlobal('fetch', fetchStep)
    notifyManager.setNotifyFunction((callback) => act(callback))
    client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0, refetchOnWindowFocus: false },
      },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    client.clear()
    container.remove()
    vi.unstubAllGlobals()
    notifyManager.setNotifyFunction((callback) => callback())
  })

  it('uses Sushi prices without changing the fetched transaction or amounts', async () => {
    await render()
    await vi.waitFor(() => expect(query?.data).toBeDefined())

    expect(query?.data?.amountIn.amount).toBe(110000000000000000n)
    expect(query?.data?.tokenIn.type).toBe('native')
    expect(query?.data?.amountOut.amount).toBe(106210478000000000n)
    expect(query?.data?.amountOutMin.amount).toBe(105679425610000000n)
    expect(query?.data?.transactionRequest).toEqual(step.transactionRequest)
    expect(query?.data?.priceImpact?.toNumber()).toBeCloseTo(0.0344502, 10)
    expect(warningSeverity(query?.data?.priceImpact)).toBe(2)
    expect(fetchStep).toHaveBeenCalledTimes(1)
    expect(sourcePrices.getFraction).toHaveBeenCalledWith(
      EvmNative.fromChainId(sourceChainId).wrap().address,
    )
    expect(destinationPrices.getFraction).toHaveBeenCalledWith(
      destinationToken.toLowerCase(),
    )
    expect(fetchStep.mock.calls[0]?.[0].toString()).toBe(
      'http://localhost:3000/api/cross-chain/step',
    )
    expect(JSON.parse(String(fetchStep.mock.calls[0]?.[1]?.body))).toEqual(step)
  })

  it('does not fall back to the corrupt aggregator valuation when Sushi prices are missing', async () => {
    destinationPrices = { getFraction: () => undefined }
    await render()
    await vi.waitFor(() => expect(query?.data).toBeDefined())

    expect(query?.data?.priceImpact).toBeUndefined()
    expect(query?.data?.amountOut.amount).toBe(106210478000000000n)
    expect(query?.data?.transactionRequest).toEqual(step.transactionRequest)
  })

  it('updates impact when prices refresh without fetching another executable step', async () => {
    await render()
    await vi.waitFor(() => expect(query?.data?.priceImpact).toBeDefined())
    const originalTransaction = query?.data?.transactionRequest
    const originalAmount = query?.data?.amountOut

    destinationPrices = { getFraction: () => new Fraction(89) }
    await render()

    expect(query?.data?.priceImpact?.toNumber()).toBeCloseTo(
      1 - (0.106210478 * 89) / (0.11 * 88.18),
      10,
    )
    expect(query?.data?.transactionRequest).toBe(originalTransaction)
    expect(query?.data?.amountOut).toBe(originalAmount)
    expect(fetchStep).toHaveBeenCalledTimes(1)
  })
})
