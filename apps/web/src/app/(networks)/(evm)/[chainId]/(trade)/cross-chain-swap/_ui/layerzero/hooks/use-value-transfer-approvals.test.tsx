/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, act, useEffect } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  delegate,
  makeExecutionTrade,
  metadata,
  wrapper,
} from 'src/lib/swap/value-transfer/execution-test-fixtures'
import {
  valueTransferMetadataResponseSchema,
  valueTransferQuoteSchema,
} from 'src/lib/swap/value-transfer/schemas'
import {
  type ValueTransferTrade,
  normalizeValueTransferTrade,
} from 'src/lib/swap/value-transfer/trade'
import { EvmNative, EvmToken, USDC } from 'sushi/evm'
import { encodeFunctionData, erc20Abi } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LayerZeroTradeApproval } from '../trade-approval'
import robinhoodHypeFixture from './robinhood-hype-quote.test-fixture.json'
import {
  getValueTransferApprovals,
  useValueTransferApprovals,
} from './use-value-transfer-approvals'

const { mountedChecker, unmountedChecker } = vi.hoisted(() => ({
  mountedChecker: vi.fn(),
  unmountedChecker: vi.fn(),
}))
vi.mock('src/lib/wagmi/systems/checker/approve-erc20-multiple', () => ({
  ApproveERC20Multiple: ({ children }: PropsWithChildren) => {
    useEffect(() => {
      mountedChecker()
      return () => {
        unmountedChecker()
      }
    }, [])
    return children
  },
}))
vi.mock('@sushiswap/ui', () => ({
  Button: ({ children }: PropsWithChildren) => (
    <button type="button" disabled>
      {children}
    </button>
  ),
  Dots: ({ children }: PropsWithChildren) => <span>{children}</span>,
}))

describe('Value Transfer approval preparation', () => {
  it('requires the full HYPE amount for the delegate in the live Robinhood quote', () => {
    const token0 = new EvmToken({
      chainId: 4663,
      address: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
      decimals: 18,
      symbol: 'HYPE',
      name: 'Sushi Bridged HYPE',
    })
    const sourceAddress = '0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0'
    const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    const quote = normalizeValueTransferTrade({
      quote: valueTransferQuoteSchema.parse(robinhoodHypeFixture.quote),
      token0,
      token1: EvmNative.fromChainId(999),
      sourceAddress,
      recipient: sourceAddress,
      srcChain: {
        chainId: 4663,
        chainKey: 'robinhood',
        chainType: 'EVM',
        name: 'Robinhood',
        shortName: 'Robinhood',
        nativeCurrency: {
          chainKey: 'robinhood',
          address: nativeAddress,
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
        },
      },
      dstChain: {
        chainId: 999,
        chainKey: 'hyperliquid',
        chainType: 'EVM',
        name: 'HyperEVM',
        shortName: 'HyperEVM',
        nativeCurrency: {
          chainKey: 'hyperliquid',
          address: nativeAddress,
          decimals: 18,
          name: 'HYPE',
          symbol: 'HYPE',
        },
      },
      quoteRequest: {
        srcChainKey: 'robinhood',
        dstChainKey: 'hyperliquid',
        srcTokenAddress: token0.address,
        dstTokenAddress: nativeAddress,
        srcWalletAddress: sourceAddress,
        dstWalletAddress: sourceAddress,
        amount: '1000000000000000000',
      },
    })
    const approvals = getValueTransferApprovals(
      quote,
      quote.quote.userSteps ?? [],
      valueTransferMetadataResponseSchema.parse(robinhoodHypeFixture.metadata),
    )
    expect(approvals).toHaveLength(1)
    expect(approvals[0].amount.amount).toBe(1_000_000_000_000_000_000n)
    expect(approvals[0].amount.currency).toBe(token0)
    expect(approvals[0].contract).toBe(
      '0x49e94180906555f8ea1733F7D37812C7163044E5',
    )
  })

  it('uses the reviewed source amount and validated delegate', () => {
    const quote = makeExecutionTrade()
    const approvals = getValueTransferApprovals(
      quote,
      quote.quote.userSteps ?? [],
      metadata,
    )
    expect(approvals).toHaveLength(1)
    expect(approvals[0].amount.amount).toBe(quote.amountIn)
    expect(approvals[0].amount.currency).toBe(quote.token0)
    expect(approvals[0].contract.toLowerCase()).toBe(delegate.toLowerCase())
  })

  it('deduplicates reset and approval steps without approving zero', () => {
    const quote = makeExecutionTrade()
    const steps = [...(quote.quote.userSteps ?? [])]
    const approval = structuredClone(steps[0])
    if (approval.type !== 'TRANSACTION' || approval.chainType !== 'EVM')
      throw new Error('Expected EVM approval fixture')
    approval.transaction.encoded.data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [delegate, 0n],
    })
    const approvals = getValueTransferApprovals(
      quote,
      [approval, ...steps],
      metadata,
    )
    expect(approvals).toHaveLength(1)
    expect(approvals[0].amount.amount).toBe(quote.amountIn)
  })

  it.each([
    ['multicall', wrapper],
    ['unrecognized contract', '0x0000000000000000000000000000000000000001'],
  ] as const)(
    'rejects an approval to %s before exposing it',
    (_name, spender) => {
      const quote = makeExecutionTrade()
      const steps = structuredClone(quote.quote.userSteps ?? [])
      const approval = steps[0]
      if (approval.type !== 'TRANSACTION' || approval.chainType !== 'EVM')
        throw new Error('Expected EVM approval fixture')
      approval.transaction.encoded.data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, quote.amountIn],
      })
      expect(() => getValueTransferApprovals(quote, steps, metadata)).toThrow(
        'The token approval does not match the reviewed transfer',
      )
    },
  )

  it('rejects mismatched selected tokens and source wallets', () => {
    const quote = makeExecutionTrade()
    expect(() =>
      getValueTransferApprovals(
        { ...quote, token0: USDC[1] },
        quote.quote.userSteps ?? [],
        metadata,
      ),
    ).toThrow('The approval token does not match the selected token')
    const steps = structuredClone(quote.quote.userSteps ?? [])
    steps[0].signerAddress = '0x0000000000000000000000000000000000000001'
    expect(() => getValueTransferApprovals(quote, steps, metadata)).toThrow(
      'The transfer step does not match the source wallet or network',
    )
  })

  it('requires no ERC20 approval when the valid route has only a bridge step', () => {
    const quote = makeExecutionTrade()
    quote.quote.userSteps = quote.quote.userSteps?.slice(1)
    expect(
      getValueTransferApprovals(quote, quote.quote.userSteps ?? [], metadata),
    ).toEqual([])
  })

  it('supports the validated Aori spender', () => {
    const quote = makeExecutionTrade(true)
    const approvals = getValueTransferApprovals(
      quote,
      quote.quote.userSteps ?? [],
      metadata,
    )
    expect(approvals[0].contract.toLowerCase()).toBe(
      '0xc6868edf1d2a7a8b759856cb8afa333210dfeda6',
    )
  })

  it('bypasses ERC20 approval for native inputs', () => {
    const quote = makeExecutionTrade()
    expect(
      getValueTransferApprovals(
        { ...quote, token0: EvmNative.fromChainId(8453) },
        [],
        {},
      ),
    ).toEqual([])
  })
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('Value Transfer approval discovery', () => {
  let container: HTMLDivElement
  let root: Root
  let queryClient: QueryClient
  let result: ReturnType<typeof useValueTransferApprovals>
  const fetchMock = vi.fn()

  function Observer({ quote }: { quote: ValueTransferTrade }) {
    result = useValueTransferApprovals({ quote, enabled: true })
    return (
      <LayerZeroTradeApproval
        quote={quote}
        enabled
        sourceNetworkFee={{ status: 'estimated', amount: 1n }}
        fallback={null}
      >
        <span>Ready to review</span>
      </LayerZeroTradeApproval>
    )
  }

  async function render(quote: ValueTransferTrade): Promise<void> {
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Observer quote={quote} />
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await vi.waitFor(() => {
        expect(result.isPending).toBe(false)
      })
    })
  }

  beforeEach(() => {
    fetchMock.mockReset()
    mountedChecker.mockClear()
    unmountedChecker.mockClear()
    vi.stubGlobal('fetch', fetchMock)
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('builds omitted user steps and reuses validated metadata across quote refreshes', async () => {
    const quote = makeExecutionTrade()
    fetchMock.mockImplementation(async (path: string) => ({
      ok: true,
      json: async () =>
        path.endsWith('metadata')
          ? metadata
          : { userSteps: quote.quote.userSteps },
    }))
    await render({ ...quote, quote: { ...quote.quote, userSteps: undefined } })
    expect(result.isSuccess).toBe(true)
    expect(result.data).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cross-chain/value-transfer/build-user-steps',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ quoteId: quote.quote.id }),
      }),
    )
    await render({ ...quote, quote: { ...quote.quote, id: 'new-quote' } })
    expect(result.isSuccess).toBe(true)
    expect(
      fetchMock.mock.calls.filter(([path]) => path.endsWith('metadata')),
    ).toHaveLength(1)
  })

  it('keeps the approval checker mounted when a refreshed quote validates with cached metadata', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => metadata })
    const quote = makeExecutionTrade()
    await render(quote)
    expect(mountedChecker).toHaveBeenCalledOnce()
    expect(unmountedChecker).not.toHaveBeenCalled()
    await render({ ...quote, quote: { ...quote.quote, id: 'refreshed-quote' } })
    expect(result.isSuccess).toBe(true)
    expect(mountedChecker).toHaveBeenCalledOnce()
    expect(unmountedChecker).not.toHaveBeenCalled()
  })

  it('refreshes stale deployment metadata without dropping an existing approval checker', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => metadata })
    const quote = makeExecutionTrade()
    await render(quote)
    queryClient.setQueryData(['value-transfer-metadata'], metadata, {
      updatedAt: Date.now() - 61_000,
    })
    await render({
      ...quote,
      quote: { ...quote.quote, id: 'metadata-refresh' },
    })
    expect(result.isSuccess).toBe(true)
    expect(mountedChecker).toHaveBeenCalledOnce()
    expect(unmountedChecker).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not carry cached approval controls onto a changed invalid token', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => metadata })
    const quote = makeExecutionTrade()
    await render(quote)
    await render({
      ...quote,
      token0: USDC[1],
      quote: { ...quote.quote, id: 'changed-token' },
    })
    expect(result.isError).toBe(true)
    expect(unmountedChecker).toHaveBeenCalledOnce()
    expect(container.textContent).not.toContain('Ready to review')
  })

  it('fails closed if metadata cannot validate the returned spender', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) })
    await render(makeExecutionTrade())
    expect(result.isError).toBe(true)
    expect(result.data).toBeUndefined()
    expect(result.error?.message).toContain(
      'The token approval does not match the reviewed transfer',
    )
  })
})
