/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type {
  ValueTransferEvmTransactionStep,
  ValueTransferUserStep,
} from 'src/lib/swap/value-transfer/schemas'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import {
  valueTransferTestSource,
  valueTransferTestTrade,
} from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { EvmChainId, EvmNative, USDC } from 'sushi/evm'
import { http, createPublicClient, encodeFunctionData, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type LayerZeroSourceNetworkFee,
  estimateValueTransferSourceNetworkFee,
  useLayerZeroSourceNetworkFee,
} from './use-layerzero-source-network-fee'

vi.mock('src/lib/swap/value-transfer/execution', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('src/lib/swap/value-transfer/execution')
  >()),
  buildValueTransferStellarTransaction: vi.fn(),
  validateValueTransferSolanaTransaction: vi.fn(),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const trade = valueTransferTestTrade()
const publicClient = createPublicClient({ chain: mainnet, transport: http() })
const bridge: ValueTransferEvmTransactionStep = {
  type: 'TRANSACTION',
  chainType: 'EVM',
  description: 'bridge',
  chainKey: 'ethereum',
  signerAddress: valueTransferTestSource,
  transaction: {
    encoded: {
      chainId: 1,
      to: '0x0000000000000000000000000000000000000001',
      data: '0x',
      value: '1000',
    },
  },
}

function approvalStep(
  amount = trade.amountIn,
): ValueTransferEvmTransactionStep {
  return {
    ...bridge,
    description: 'approve',
    transaction: {
      encoded: {
        chainId: 1,
        to: USDC[1].address,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [bridge.transaction.encoded.to, amount],
        }),
      },
    },
  }
}

function tradeWithSteps(steps: ValueTransferUserStep[]): ValueTransferTrade {
  return { ...trade, quote: { ...trade.quote, userSteps: steps } }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Value Transfer source gas estimate', () => {
  it('does not estimate a disconnected preview', async () => {
    expect(
      await estimateValueTransferSourceNetworkFee({
        ...trade,
        sourceAddress: undefined,
      }),
    ).toEqual({ status: 'connect-wallet' })
  })

  it('estimates returned EVM transaction gas separately from native bridge fees', async () => {
    const estimateGas = vi
      .spyOn(publicClient, 'estimateGas')
      .mockResolvedValue(100_000n)
    vi.spyOn(publicClient, 'getGasPrice').mockResolvedValue(20n)
    const result = await estimateValueTransferSourceNetworkFee(
      tradeWithSteps([bridge]),
      publicClient,
    )
    expect(result).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(estimateGas.mock.lastCall?.[0].value).toBe(1000n)
  })

  it('estimates the transfer after an approval even when the cached quote retains it', async () => {
    const readContract = vi
      .spyOn(publicClient, 'readContract')
      .mockResolvedValue(trade.amountIn)
    const estimateGas = vi
      .spyOn(publicClient, 'estimateGas')
      .mockResolvedValue(100_000n)
    vi.spyOn(publicClient, 'getGasPrice').mockResolvedValue(20n)

    expect(
      await estimateValueTransferSourceNetworkFee(
        tradeWithSteps([approvalStep(), bridge]),
        publicClient,
      ),
    ).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(readContract).toHaveBeenCalledWith({
      address: USDC[1].address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [valueTransferTestSource, bridge.transaction.encoded.to],
    })
    expect(estimateGas).toHaveBeenCalledTimes(1)
    expect(estimateGas.mock.lastCall?.[0].to).toBe(
      bridge.transaction.encoded.to,
    )
  })

  it.each([trade.amountIn, 0n])(
    'requires enough allowance for the transfer, including an approval reset (%s)',
    async (approvalAmount) => {
      vi.spyOn(publicClient, 'readContract').mockResolvedValue(
        trade.amountIn - 1n,
      )
      const estimateGas = vi.spyOn(publicClient, 'estimateGas')
      expect(
        await estimateValueTransferSourceNetworkFee(
          tradeWithSteps([approvalStep(approvalAmount), bridge]),
          publicClient,
        ),
      ).toEqual({ status: 'approval-required' })
      expect(estimateGas).not.toHaveBeenCalled()
    },
  )

  it('does not misreport an allowance RPC failure as an approval requirement', async () => {
    vi.spyOn(publicClient, 'readContract').mockRejectedValue(
      new Error('RPC unavailable'),
    )
    await expect(
      estimateValueTransferSourceNetworkFee(
        tradeWithSteps([approvalStep(), bridge]),
        publicClient,
      ),
    ).rejects.toThrow('RPC unavailable')
  })

  it('identifies approvals by calldata rather than a bridge description', async () => {
    const readContract = vi.spyOn(publicClient, 'readContract')
    vi.spyOn(publicClient, 'estimateGas').mockResolvedValue(100_000n)
    vi.spyOn(publicClient, 'getGasPrice').mockResolvedValue(20n)
    expect(
      await estimateValueTransferSourceNetworkFee(
        tradeWithSteps([{ ...bridge, description: 'Approve and bridge HYPE' }]),
        publicClient,
      ),
    ).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(readContract).not.toHaveBeenCalled()
  })

  it('does not show zero transfer gas when only approval steps are returned', async () => {
    const estimateGas = vi.spyOn(publicClient, 'estimateGas')
    expect(
      await estimateValueTransferSourceNetworkFee(
        tradeWithSteps([approvalStep()]),
        publicClient,
      ),
    ).toEqual({ status: 'unavailable' })
    expect(estimateGas).not.toHaveBeenCalled()
  })

  it('estimates native HYPE gas without requiring an ERC20 approval', async () => {
    const hypeClient = createPublicClient({
      chain: { ...mainnet, id: EvmChainId.HYPEREVM },
      transport: http(),
    })
    const estimateGas = vi
      .spyOn(hypeClient, 'estimateGas')
      .mockResolvedValue(100_000n)
    const readContract = vi.spyOn(hypeClient, 'readContract')
    vi.spyOn(hypeClient, 'getGasPrice').mockResolvedValue(20n)
    const hypeTrade: ValueTransferTrade = {
      ...tradeWithSteps([
        {
          ...bridge,
          chainKey: 'hyperliquid',
          transaction: {
            encoded: {
              ...bridge.transaction.encoded,
              chainId: EvmChainId.HYPEREVM,
              value: '110000000000001000',
            },
          },
        },
      ]),
      fromChainId: EvmChainId.HYPEREVM,
      token0: EvmNative.fromChainId(EvmChainId.HYPEREVM),
      amountIn: 110_000_000_000_000_000n,
      srcChain: {
        ...trade.srcChain,
        chainKey: 'hyperliquid',
        chainId: EvmChainId.HYPEREVM,
      },
    }
    expect(
      await estimateValueTransferSourceNetworkFee(hypeTrade, hypeClient),
    ).toEqual({
      status: 'estimated',
      amount: 2_000_000n,
    })
    expect(estimateGas.mock.lastCall?.[0].value).toBe(110_000_000_000_001_000n)
    expect(readContract).not.toHaveBeenCalled()
  })

  it('builds fresh user steps when the quote omits them', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        userSteps: [
          {
            type: 'SIGNATURE',
            description: 'bridge',
            chainKey: 'ethereum',
            signerAddress: valueTransferTestSource,
            signature: {
              type: 'EIP712',
              typedData: {
                primaryType: 'Order',
                domain: {
                  verifyingContract:
                    '0x0000000000000000000000000000000000000001',
                },
                types: {},
                message: {},
              },
            },
          },
        ],
      }),
    )
    vi.stubGlobal('fetch', fetch)
    expect(await estimateValueTransferSourceNetworkFee(trade)).toEqual({
      status: 'estimated',
      amount: 0n,
    })
    expect(JSON.parse(fetch.mock.lastCall?.[1].body)).toEqual({
      quoteId: 'quote-1',
    })
  })
})

describe('Value Transfer source gas refresh', () => {
  let root: Root
  let container: HTMLDivElement
  let queryClient: QueryClient
  let fee: LayerZeroSourceNetworkFee
  const quote = tradeWithSteps([approvalStep(), bridge])

  function Harness(props: Parameters<typeof useLayerZeroSourceNetworkFee>[0]) {
    fee = useLayerZeroSourceNetworkFee(props)
    return null
  }

  async function renderFee(sourceClient: typeof publicClient | undefined) {
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness quote={quote} enabled publicClient={sourceClient} />
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
    focusManager.setFocused(true)
    queryClient = new QueryClient({
      defaultOptions: { queries: { gcTime: 0 } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    vi.spyOn(publicClient, 'estimateGas').mockResolvedValue(100_000n)
    vi.spyOn(publicClient, 'getGasPrice').mockResolvedValue(20n)
  })

  afterEach(() => {
    act(() => root.unmount())
    queryClient.clear()
    container.remove()
    focusManager.setFocused(undefined)
    vi.useRealTimers()
  })

  it('refreshes pending allowance after approval without needing a new quote ID', async () => {
    const readContract = vi
      .spyOn(publicClient, 'readContract')
      .mockResolvedValue(0n)
    await renderFee(publicClient)
    expect(fee).toEqual({ status: 'approval-required' })
    expect(publicClient.estimateGas).not.toHaveBeenCalled()

    readContract.mockResolvedValue(trade.amountIn)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_001)
    })
    expect(fee).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(readContract).toHaveBeenCalledTimes(2)
    expect(publicClient.estimateGas).toHaveBeenCalledTimes(1)
  })

  it('estimates when a source client becomes available after the quote loads', async () => {
    const readContract = vi
      .spyOn(publicClient, 'readContract')
      .mockResolvedValue(trade.amountIn)
    await renderFee(undefined)
    expect(fee).toEqual({ status: 'unavailable' })
    expect(readContract).not.toHaveBeenCalled()

    await renderFee(publicClient)
    expect(fee).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(readContract).toHaveBeenCalledTimes(1)
  })

  it('shows unavailable rather than approval-required on an allowance RPC error', async () => {
    vi.spyOn(publicClient, 'readContract').mockRejectedValue(
      new Error('RPC unavailable'),
    )
    await renderFee(publicClient)
    expect(fee).toEqual({ status: 'unavailable' })
  })
})
