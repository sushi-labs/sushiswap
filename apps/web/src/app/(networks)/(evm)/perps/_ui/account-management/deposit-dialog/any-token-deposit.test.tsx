/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { PerpsDepositTransactionFees } from 'src/lib/perps/deposit/get-perps-deposit-transaction-fees'
import {
  type LifiPerpsRoute,
  lifiPerpsRouteSchema,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import { useLifiPerpsDepositExecution } from 'src/lib/perps/deposit/use-lifi-perps-deposit-execution'
import { Amount } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  USDC,
} from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnyTokenDeposit } from './any-token-deposit'
import {
  ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS,
  type AnyTokenAnyChainDepositChainId,
} from './any-token-deposit-config'

const mocks = vi.hoisted(() => ({
  useRoutes: vi.fn(),
  useStep: vi.fn(),
  useStatus: vi.fn(),
  useMyTokens: vi.fn(),
  usePublicClient: vi.fn(),
  useRefetchBalances: vi.fn(),
  useSimulateContract: vi.fn(),
  checkNetwork: vi.fn(),
  checkApproval: vi.fn(),
  useApproved: vi.fn(),
  sendTransaction: vi.fn(),
  writeContract: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
  refetchBalances: vi.fn(),
  invalidateQueries: vi.fn(),
  getFees: vi.fn(),
  getUSDCArgs: vi.fn(),
  createToast: vi.fn(),
  createErrorToast: vi.fn(),
}))

vi.mock('@sushiswap/notifications', () => ({
  createToast: mocks.createToast,
  createErrorToast: mocks.createErrorToast,
}))
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}))
vi.mock('@sushiswap/ui', () => {
  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }
  return {
    Button: ({ children, onClick, disabled }: ComponentProps<'button'>) => (
      <button type="button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
    Currency: { Icon: () => null },
    Dots: Wrapper,
    Select: Wrapper,
    SelectContent: Wrapper,
    SelectItem: Wrapper,
    SelectTrigger: Wrapper,
    SkeletonBox: () => null,
  }
})
vi.mock('framer-motion', () => {
  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }
  return { AnimatePresence: Wrapper, motion: { div: Wrapper } }
})
vi.mock('src/lib/perps/deposit/use-lifi-perps-deposit', () => ({
  useLifiPerpsDepositRoutes: mocks.useRoutes,
  useLifiPerpsDepositStep: mocks.useStep,
}))
vi.mock('src/lib/perps/deposit/use-lifi-perps-deposit-status', () => ({
  useLifiPerpsDepositStatus: mocks.useStatus,
}))
vi.mock('src/lib/hooks/react-query/trade/use-evm-trade', () => ({
  useEvmTrade: vi.fn(),
}))
vi.mock('src/lib/hooks/react-query/trade/use-evm-trade-quote', () => ({
  useEvmTradeQuote: vi.fn(),
}))
vi.mock('src/lib/wagmi/components/token-selector/hooks/use-my-tokens', () => ({
  useMyTokens: mocks.useMyTokens,
}))
vi.mock('src/lib/wagmi/errors', () => ({ isUserRejectedError: () => false }))
vi.mock('src/lib/wagmi/systems/checker', () => {
  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }
  return {
    Checker: {
      Connect: Wrapper,
      Network: (props: PropsWithChildren<{ chainId: number }>) => {
        mocks.checkNetwork(props.chainId)
        return <>{props.children}</>
      },
      Amounts: Wrapper,
      Custom: ({
        children,
        showChildren,
        buttonText,
      }: PropsWithChildren<{ showChildren: boolean; buttonText: string }>) =>
        showChildren ? (
          children
        ) : (
          <button type="button" disabled>
            {buttonText}
          </button>
        ),
      ApproveERC20: (props: PropsWithChildren) => {
        mocks.checkApproval(props)
        return <>{props.children}</>
      },
      Success: Wrapper,
    },
  }
})
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  useApproved: mocks.useApproved,
}))
vi.mock('src/lib/perps/deposit/get-perps-deposit-transaction-fees', () => ({
  getPerpsDepositTransactionFees: mocks.getFees,
}))
vi.mock('src/lib/wallet', () => ({ useAccount: () => connectedAddress }))
vi.mock('wagmi', () => ({
  useEstimateGas: () => ({ data: 21_000n, isLoading: false }),
  useGasPrice: vi.fn(),
  usePublicClient: mocks.usePublicClient,
  useSendTransaction: () => ({
    mutateAsync: mocks.sendTransaction,
    isPending: false,
  }),
  useSimulateContract: mocks.useSimulateContract,
  useWriteContract: () => ({
    mutateAsync: mocks.writeContract,
    isPending: false,
  }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: mocks.useRefetchBalances,
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: () => ({ data: undefined }),
}))
vi.mock('../../_common', () => ({
  InputWithKeyboard: ({
    setAmount,
  }: { setAmount: (amount: string) => void }) => (
    <button type="button" onClick={() => setAmount('1')}>
      Use one token
    </button>
  ),
}))
vi.mock('../../perps-checker', () => ({
  PerpsChecker: { Legal: ({ children }: PropsWithChildren) => <>{children}</> },
}))
vi.mock('./usdc-options', () => ({
  USDCOptions: () => null,
  getMinDepositAmount: () => 5,
  getUSDCArgs: mocks.getUSDCArgs,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const walletAddress = '0x0000000000000000000000000000000000000001'
const otherWalletAddress = '0x0000000000000000000000000000000000000003'
const bridgeAddress = '0x0000000000000000000000000000000000000002'
const txHash =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
const replacementTxHash =
  '0x0000000000000000000000000000000000000000000000000000000000000002'
let connectedAddress: EvmAddress = walletAddress
const freshFees = {
  type: 'eip1559',
  gasPrice: undefined,
  maxFeePerGas: 32n,
  maxPriorityFeePerGas: 2n,
} satisfies PerpsDepositTransactionFees

function createRoute(fromAmount: Amount<EvmCurrency>): LifiPerpsRoute {
  const fromToken = {
    address:
      fromAmount.currency.type === 'native'
        ? '0x0000000000000000000000000000000000000000'
        : fromAmount.currency.address,
    chainId: fromAmount.currency.chainId,
    decimals: fromAmount.currency.decimals,
    symbol: fromAmount.currency.symbol,
    name: fromAmount.currency.name,
    priceUSD: '1',
  }
  const toToken = {
    chainId: 1337,
    address: USDC[EvmChainId.ARBITRUM].address,
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    priceUSD: '1',
  }
  const action = {
    fromChainId: fromAmount.currency.chainId,
    fromAmount: fromAmount.amount.toString(),
    fromToken,
    fromAddress: connectedAddress,
    toChainId: 1337,
    toToken,
    toAddress: connectedAddress,
    slippage: 0.005,
  }
  return lifiPerpsRouteSchema.parse({
    ...action,
    id: 'perps-route',
    toAmount: '11000000',
    toAmountMin: '10000000',
    step: {
      id: 'perps-step',
      type: 'lifi',
      tool: 'across',
      toolDetails: { key: 'across', name: 'Across', logoURI: '' },
      action,
      estimate: {
        fromAmount: fromAmount.amount.toString(),
        toAmount: '11000000',
        toAmountMin: '10000000',
        approvalAddress: bridgeAddress,
        executionDuration: 30,
      },
      includedSteps: [{ action }],
    },
  })
}

describe('AnyTokenDeposit direct perps deposits', () => {
  let container: HTMLDivElement
  let root: Root
  let setOpen: ReturnType<typeof vi.fn>

  function renderDeposit(
    chainId: AnyTokenAnyChainDepositChainId = EvmChainId.ETHEREUM,
  ): void {
    root.render(
      <AnyTokenDeposit
        depositOption={{
          chainId,
          value: `any-${chainId}`,
          label: 'Any Token',
          type: 'any-token-any-chain',
        }}
        setOpen={setOpen}
      />,
    )
  }

  function button(label: string): HTMLButtonElement {
    const element = Array.from(container.querySelectorAll('button')).find(
      (item) => item.textContent === label,
    )
    if (!element) throw new Error(`Button not found: ${label}`)
    return element
  }

  async function submitDeposit(
    chainId: AnyTokenAnyChainDepositChainId = EvmChainId.ETHEREUM,
  ): Promise<void> {
    act(() => renderDeposit(chainId))
    act(() => button('Use one token').click())
    await act(async () => button('Deposit').click())
  }

  beforeEach(() => {
    vi.resetAllMocks()
    connectedAddress = walletAddress
    mocks.useMyTokens.mockImplementation(
      ({ chainId }: { chainId: EvmChainId }) => ({
        data: {
          tokens: [EvmNative.fromChainId(chainId)],
          balanceMap: new Map(),
        },
        isLoading: false,
      }),
    )
    mocks.useRoutes.mockImplementation(
      ({ fromAmount }: { fromAmount?: Amount<EvmCurrency> }) => ({
        data: fromAmount ? [createRoute(fromAmount)] : [],
        isLoading: false,
        isError: false,
      }),
    )
    mocks.useStep.mockImplementation(
      ({
        step,
        enabled,
      }: {
        step?: ReturnType<typeof createRoute>['step']
        enabled?: boolean
      }) => ({
        data:
          step && enabled !== false
            ? {
                ...step,
                transactionRequest: {
                  chainId: step.action.fromChainId,
                  from: step.action.fromAddress,
                  to: bridgeAddress,
                  data: '0x12345678',
                  value: step.action.fromAmount,
                  gasPrice: '2',
                },
              }
            : undefined,
        isLoading: false,
        isError: false,
      }),
    )
    mocks.useStatus.mockImplementation(
      ({ enabled }: { enabled?: boolean }) => ({
        data: enabled ? { state: 'pending' } : undefined,
      }),
    )
    mocks.usePublicClient.mockReturnValue({
      waitForTransactionReceipt: mocks.waitForTransactionReceipt,
    })
    mocks.waitForTransactionReceipt.mockResolvedValue({
      status: 'success',
      transactionHash: txHash,
    })
    mocks.sendTransaction.mockResolvedValue(txHash)
    mocks.useRefetchBalances.mockReturnValue({
      refetchChain: mocks.refetchBalances,
    })
    mocks.getFees.mockResolvedValue(freshFees)
    mocks.invalidateQueries.mockResolvedValue(undefined)
    mocks.useApproved.mockReturnValue({ approved: true })
    setOpen = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'deposits from configured source %s with only one source transaction',
    async (chainId) => {
      await submitDeposit(chainId)

      expect(mocks.useRoutes).toHaveBeenCalledWith(
        expect.objectContaining({
          fromAmount: Amount.fromHuman(EvmNative.fromChainId(chainId), '1'),
          address: walletAddress,
        }),
      )
      expect(mocks.sendTransaction).toHaveBeenCalledOnce()
      expect(mocks.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          chainId,
          account: walletAddress,
          to: bridgeAddress,
          value: 1_000_000_000_000_000_000n,
          ...freshFees,
        }),
      )
      expect(mocks.getFees).toHaveBeenCalledWith(chainId, expect.any(Object))
      expect(mocks.useStatus).toHaveBeenLastCalledWith(
        expect.objectContaining({ txHash, fromChainId: chainId }),
      )
      expect(setOpen).not.toHaveBeenCalled()

      mocks.useStatus.mockReturnValue({ data: { state: 'completed' } })
      await act(async () => renderDeposit(chainId))

      expect(setOpen).toHaveBeenCalledWith(false)
      expect(mocks.writeContract).not.toHaveBeenCalled()
      expect(mocks.getUSDCArgs).not.toHaveBeenCalled()
      expect(mocks.useSimulateContract).not.toHaveBeenCalled()
      expect(
        mocks.usePublicClient.mock.calls.every(
          ([args]) => args.chainId === chainId,
        ),
      ).toBe(true)
      expect(
        mocks.checkNetwork.mock.calls.every(([network]) => network === chainId),
      ).toBe(true)
    },
  )

  it('refreshes perps state and closes only once after verified completion', async () => {
    await submitDeposit()
    mocks.useStatus.mockReturnValue({ data: { state: 'completed' } })
    await act(async () => renderDeposit())
    await act(async () => renderDeposit())

    expect(setOpen).toHaveBeenCalledTimes(1)
    expect(mocks.invalidateQueries).toHaveBeenCalledTimes(2)
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useClearinghouseState', walletAddress],
    })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useUserNonFundingLedgerUpdates', walletAddress],
    })
  })

  it.each(['pending', 'failed', 'partial', 'refunded', 'unverified'] as const)(
    'keeps a %s deposit open without reporting success or resubmitting',
    async (state) => {
      await submitDeposit()
      mocks.useStatus.mockReturnValue({ data: { state } })
      await act(async () => renderDeposit())
      await act(async () => renderDeposit())

      expect(setOpen).not.toHaveBeenCalled()
      expect(mocks.invalidateQueries).not.toHaveBeenCalled()
      expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
      expect(mocks.writeContract).not.toHaveBeenCalled()
      expect(mocks.useStatus).toHaveBeenLastCalledWith(
        expect.objectContaining({ txHash }),
      )
    },
  )

  it('retains a reverted source transaction as a failure until retry', async () => {
    mocks.waitForTransactionReceipt.mockResolvedValue({
      status: 'reverted',
      transactionHash: txHash,
    })
    await submitDeposit()

    expect(setOpen).not.toHaveBeenCalled()
    expect(mocks.invalidateQueries).not.toHaveBeenCalled()
    expect(button('Try again').disabled).toBe(false)
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
    await expect(
      mocks.createToast.mock.calls[0]?.[0].promise,
    ).rejects.toMatchObject({
      name: 'TransactionReceiptRevertedError',
    })
  })

  it('tracks the replacement hash when the source transaction is repriced', async () => {
    const receipt = Promise.withResolvers<{ status: 'success' }>()
    mocks.waitForTransactionReceipt.mockReturnValue(receipt.promise)
    await submitDeposit()
    const options = mocks.waitForTransactionReceipt.mock.calls[0]?.[0]
    expect(options.onReplaced).toEqual(expect.any(Function))

    act(() =>
      options.onReplaced({
        reason: 'repriced',
        transaction: { hash: replacementTxHash },
      }),
    )
    await act(async () => receipt.resolve({ status: 'success' }))
    await expect(mocks.createToast.mock.calls[0]?.[0].promise).resolves.toEqual(
      {
        status: 'success',
      },
    )

    expect(mocks.useStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({
        txHash: replacementTxHash,
        fromChainId: EvmChainId.ETHEREUM,
        enabled: true,
      }),
    )
    expect(container.querySelector('a')?.href).toContain(replacementTxHash)
    expect(setOpen).not.toHaveBeenCalled()

    mocks.useStatus.mockReturnValue({ data: { state: 'completed' } })
    await act(async () => renderDeposit())
    expect(setOpen).toHaveBeenCalledWith(false)
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
  })

  it.each(['cancelled', 'replaced'] as const)(
    'stops tracking a %s source transaction without marking the deposit complete',
    async (reason) => {
      const receipt = Promise.withResolvers<{ status: 'success' }>()
      mocks.waitForTransactionReceipt.mockReturnValue(receipt.promise)
      await submitDeposit()
      const options = mocks.waitForTransactionReceipt.mock.calls[0]?.[0]
      act(() =>
        options.onReplaced({
          reason,
          transaction: { hash: replacementTxHash },
        }),
      )
      await act(async () => receipt.resolve({ status: 'success' }))
      mocks.useStatus.mockReturnValue({ data: { state: 'completed' } })
      await act(async () => renderDeposit())

      expect(mocks.useStatus).toHaveBeenLastCalledWith(
        expect.objectContaining({ txHash: replacementTxHash, enabled: false }),
      )
      expect(setOpen).not.toHaveBeenCalled()
      expect(mocks.invalidateQueries).not.toHaveBeenCalled()
      expect(container.textContent).toContain('cancelled or replaced')
      expect(button('Try again').disabled).toBe(false)
      expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
      await expect(
        mocks.createToast.mock.calls[0]?.[0].promise,
      ).rejects.toMatchObject({
        name: 'TransactionReplacedError',
      })
    },
  )

  it('keeps a broadcast transaction when its wallet prompt finishes after dismissal', async () => {
    function PersistentDeposit({ visible }: { visible: boolean }) {
      const execution = useLifiPerpsDepositExecution()
      return visible ? (
        <AnyTokenDeposit
          depositOption={{
            chainId: EvmChainId.ETHEREUM,
            value: `any-${EvmChainId.ETHEREUM}`,
            label: 'Any Token',
            type: 'any-token-any-chain',
          }}
          setOpen={setOpen}
          execution={execution}
        />
      ) : null
    }
    const broadcast = Promise.withResolvers<typeof txHash>()
    mocks.sendTransaction.mockReturnValue(broadcast.promise)
    act(() => root.render(<PersistentDeposit visible />))
    act(() => button('Use one token').click())
    await act(async () => button('Deposit').click())
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
    act(() => root.render(<PersistentDeposit visible={false} />))

    await act(async () => broadcast.resolve(txHash))
    act(() => root.render(<PersistentDeposit visible />))

    expect(mocks.useStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({
        txHash,
        fromChainId: EvmChainId.ETHEREUM,
        recipient: walletAddress,
        enabled: true,
      }),
    )
    expect(container.textContent).toContain('Waiting for perps USDC')
    expect(button('Deposit pending').disabled).toBe(true)
    expect(setOpen).not.toHaveBeenCalled()
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
  })

  it('uses refreshed legacy fees instead of the LI.FI quote price', async () => {
    mocks.getFees.mockResolvedValue({
      type: 'legacy',
      gasPrice: 125n,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
    } satisfies PerpsDepositTransactionFees)
    await submitDeposit()
    expect(mocks.sendTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'legacy',
        gasPrice: 125n,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined,
      }),
    )
  })

  it('does not submit a stale quoted fee when current fee estimation fails', async () => {
    mocks.getFees.mockRejectedValue(new Error('RPC unavailable'))
    await submitDeposit()
    expect(mocks.sendTransaction).not.toHaveBeenCalled()
    expect(mocks.createErrorToast).toHaveBeenCalledWith(
      'RPC unavailable',
      false,
      'perps',
    )
    expect(button('Deposit').disabled).toBe(false)
  })

  it('does not submit twice while source transaction fees are loading', async () => {
    const fees = Promise.withResolvers<PerpsDepositTransactionFees>()
    mocks.getFees.mockReturnValue(fees.promise)
    act(() => renderDeposit())
    act(() => button('Use one token').click())
    const depositButton = button('Deposit')
    await act(async () => {
      depositButton.click()
      depositButton.click()
    })
    await act(async () => fees.resolve(freshFees))

    expect(mocks.getFees).toHaveBeenCalledTimes(1)
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
  })

  it('aborts submission when the wallet changes during fee preparation', async () => {
    const fees = Promise.withResolvers<PerpsDepositTransactionFees>()
    mocks.getFees.mockReturnValue(fees.promise)
    await submitDeposit()

    connectedAddress = otherWalletAddress
    act(() => renderDeposit())
    await act(async () => fees.resolve(freshFees))

    expect(mocks.sendTransaction).not.toHaveBeenCalled()
    expect(setOpen).not.toHaveBeenCalled()
  })

  it('aborts submission when the source changes during fee preparation', async () => {
    const fees = Promise.withResolvers<PerpsDepositTransactionFees>()
    mocks.getFees.mockReturnValue(fees.promise)
    await submitDeposit(EvmChainId.ETHEREUM)

    act(() => renderDeposit(EvmChainId.BASE))
    await act(async () => fees.resolve(freshFees))

    expect(mocks.sendTransaction).not.toHaveBeenCalled()
    expect(setOpen).not.toHaveBeenCalled()
  })

  it('does not submit a prepared step belonging to another wallet', async () => {
    const route = createRoute(
      Amount.fromHuman(EvmNative.fromChainId(EvmChainId.ETHEREUM), '1'),
    )
    mocks.useStep.mockReturnValue({
      data: {
        ...route.step,
        action: { ...route.step.action, fromAddress: otherWalletAddress },
        transactionRequest: {
          chainId: EvmChainId.ETHEREUM,
          from: otherWalletAddress,
          to: bridgeAddress,
          data: '0x12345678',
          value: route.fromAmount,
        },
      },
      isLoading: false,
    })
    act(() => renderDeposit())
    act(() => button('Use one token').click())

    expect(button('Deposit').disabled).toBe(true)
    await act(async () => button('Deposit').click())
    expect(mocks.sendTransaction).not.toHaveBeenCalled()
  })

  it('tracks the original deposit after wallet and source changes without closing the new wallet', async () => {
    await submitDeposit(EvmChainId.ETHEREUM)
    connectedAddress = otherWalletAddress
    act(() => renderDeposit(EvmChainId.BASE))

    expect(mocks.useStatus).toHaveBeenLastCalledWith(
      expect.objectContaining({
        txHash,
        fromChainId: EvmChainId.ETHEREUM,
        recipient: walletAddress,
        minimumAmount: '10000000',
      }),
    )
    mocks.useStatus.mockReturnValue({ data: { state: 'completed' } })
    await act(async () => renderDeposit(EvmChainId.BASE))

    expect(setOpen).not.toHaveBeenCalled()
    expect(mocks.sendTransaction).toHaveBeenCalledTimes(1)
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useClearinghouseState', walletAddress],
    })
  })

  it('does not offer a deposit when there is no route', () => {
    mocks.useRoutes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })
    act(() => renderDeposit())
    act(() => button('Use one token').click())

    expect(button('No deposit route available').disabled).toBe(true)
    expect(mocks.sendTransaction).not.toHaveBeenCalled()
  })

  it('requests ERC20 approval on the selected source only', async () => {
    mocks.useApproved.mockReturnValue({ approved: false })
    mocks.useMyTokens.mockReturnValue({
      data: { tokens: [USDC[EvmChainId.BASE]], balanceMap: new Map() },
      isLoading: false,
    })
    act(() => renderDeposit(EvmChainId.BASE))
    act(() => button('Use one token').click())

    expect(mocks.checkApproval).toHaveBeenLastCalledWith(
      expect.objectContaining({
        contract: bridgeAddress,
        amount: Amount.fromHuman(USDC[EvmChainId.BASE], '1'),
        enabled: true,
      }),
    )
    expect(mocks.checkNetwork).toHaveBeenLastCalledWith(EvmChainId.BASE)
    expect(mocks.useStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false }),
    )
  })

  it('prepares an ERC20 direct-transfer route without approval when LI.FI skips approval', () => {
    mocks.useApproved.mockReturnValue({ approved: false })
    mocks.useMyTokens.mockReturnValue({
      data: { tokens: [USDC[EvmChainId.ARBITRUM]], balanceMap: new Map() },
      isLoading: false,
    })
    mocks.useRoutes.mockImplementation(
      ({ fromAmount }: { fromAmount?: Amount<EvmCurrency> }) => {
        const route = fromAmount ? createRoute(fromAmount) : undefined
        if (route) route.step.estimate.skipApproval = true
        return { data: route ? [route] : [], isLoading: false, isError: false }
      },
    )

    act(() => renderDeposit(EvmChainId.ARBITRUM))
    act(() => button('Use one token').click())

    expect(mocks.checkApproval).toHaveBeenLastCalledWith(
      expect.objectContaining({
        amount: Amount.fromHuman(USDC[EvmChainId.ARBITRUM], '1'),
        enabled: false,
      }),
    )
    expect(mocks.useStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    )
    expect(button('Deposit').disabled).toBe(false)
  })
})
