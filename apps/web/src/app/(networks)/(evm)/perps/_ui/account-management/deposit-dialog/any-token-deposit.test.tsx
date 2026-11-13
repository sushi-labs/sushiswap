/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { EvmChainId, type EvmCurrency, EvmNative, USDC } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnyTokenDeposit } from './any-token-deposit'

const mocks = vi.hoisted(() => ({
  useRoutes: vi.fn(),
  useStep: vi.fn(),
  useMyTokens: vi.fn(),
  usePublicClient: vi.fn(),
  useLiFiStatus: vi.fn(),
  sendTransaction: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
  refetchBalances: vi.fn(),
  getFees: vi.fn(),
  getUSDCArgs: vi.fn(),
}))

vi.mock('@sushiswap/notifications', () => ({
  createToast: vi.fn(),
  createErrorToast: vi.fn(),
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
vi.mock(
  'src/lib/hooks/react-query/cross-chain-trade/use-cross-chain-trade-routes',
  () => ({
    useCrossChainTradeRoutes: mocks.useRoutes,
  }),
)
vi.mock(
  'src/lib/hooks/react-query/cross-chain-trade/use-cross-chain-trade-step',
  () => ({
    useCrossChainTradeStep: mocks.useStep,
  }),
)
vi.mock('src/lib/hooks/react-query/trade/use-evm-trade', () => ({
  useEvmTrade: vi.fn(),
}))
vi.mock('src/lib/hooks/react-query/trade/use-evm-trade-quote', () => ({
  useEvmTradeQuote: vi.fn(),
}))
vi.mock('src/lib/swap/cross-chain', () => ({
  useLiFiStatus: mocks.useLiFiStatus,
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
      Network: Wrapper,
      Amounts: Wrapper,
      Custom: Wrapper,
      ApproveERC20: Wrapper,
      Success: Wrapper,
    },
  }
})
vi.mock('src/lib/wagmi/systems/checker/provider', () => ({
  useApproved: () => ({ approved: true }),
}))
vi.mock('src/lib/wagmi/transactions/get-robinhood-transaction-fees', () => ({
  getRobinhoodTransactionFees: mocks.getFees,
}))
vi.mock('src/lib/wallet', () => ({ useAccount: () => walletAddress }))
vi.mock('wagmi', () => ({
  useEstimateGas: () => ({ data: 21_000n, isLoading: false }),
  useGasPrice: vi.fn(),
  usePublicClient: mocks.usePublicClient,
  useSendTransaction: () => ({
    mutateAsync: mocks.sendTransaction,
    isPending: false,
  }),
  useSimulateContract: () => ({ data: undefined }),
  useWriteContract: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: mocks.refetchBalances }),
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
const bridgeAddress = '0x0000000000000000000000000000000000000002'
const txHash =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
const bridgeStep = { estimate: { approvalAddress: bridgeAddress } }

describe('AnyTokenDeposit cross-chain sources', () => {
  let container: HTMLDivElement
  let root: Root

  function button(label: string): HTMLButtonElement {
    const element = Array.from(container.querySelectorAll('button')).find(
      (item) => item.textContent === label,
    )
    if (!element) throw new Error(`Button not found: ${label}`)
    return element
  }

  beforeEach(() => {
    vi.resetAllMocks()
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
        data: fromAmount
          ? [
              {
                step: bridgeStep,
                fromAmount: fromAmount.amount.toString(),
                toAmount: '11000000',
                toAmountMin: '10000000',
              },
            ]
          : [],
        isLoading: false,
        isError: false,
      }),
    )
    mocks.useStep.mockImplementation(
      ({ step }: { step?: typeof bridgeStep }) => ({
        data: step
          ? {
              transactionRequest: {
                from: walletAddress,
                to: bridgeAddress,
                data: '0x',
                value: '1000000000000000000',
                gasPrice: '2',
              },
            }
          : undefined,
        isLoading: false,
      }),
    )
    mocks.usePublicClient.mockReturnValue({
      waitForTransactionReceipt: mocks.waitForTransactionReceipt,
    })
    mocks.waitForTransactionReceipt.mockResolvedValue({ status: 'success' })
    mocks.sendTransaction.mockResolvedValue(txHash)
    mocks.useLiFiStatus.mockReturnValue({ data: undefined })
    mocks.getFees.mockResolvedValue(undefined)
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each([EvmChainId.ETHEREUM, EvmChainId.ROBINHOOD] as const)(
    'bridges tokens from chain %s and deposits USDC on Arbitrum',
    async (chainId) => {
      function renderDeposit(): void {
        root.render(
          <AnyTokenDeposit
            depositOption={{
              chainId,
              value: `any-${chainId}`,
              label: 'Any Token',
              type: 'any-token-any-chain',
            }}
            setOpen={vi.fn()}
          />,
        )
      }
      act(renderDeposit)
      act(() => button('Use one token').click())

      expect(mocks.useRoutes).toHaveBeenLastCalledWith(
        expect.objectContaining({
          fromAmount: Amount.fromHuman(EvmNative.fromChainId(chainId), '1'),
          toToken: USDC[EvmChainId.ARBITRUM],
          fromAddress: walletAddress,
          toAddress: walletAddress,
        }),
      )
      expect(mocks.usePublicClient).toHaveBeenCalledWith({ chainId })
      expect(mocks.usePublicClient).toHaveBeenCalledWith({
        chainId: EvmChainId.ARBITRUM,
      })
      expect(button('Swap & Bridge').disabled).toBe(false)

      await act(async () => button('Swap & Bridge').click())

      expect(mocks.sendTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          chainId,
          account: walletAddress,
          to: bridgeAddress,
          value: 1_000_000_000_000_000_000n,
        }),
      )
      expect(mocks.getFees).toHaveBeenCalledWith(chainId, expect.any(Object))
      expect(container.textContent).toContain('Waiting for USDC on Arbitrum')

      mocks.useLiFiStatus.mockReturnValue({
        data: { status: 'DONE', substatus: 'COMPLETED' },
      })
      act(renderDeposit)

      expect(mocks.getUSDCArgs).toHaveBeenCalledWith({
        chainId: EvmChainId.ARBITRUM,
        amount: 10_000_000n,
      })
      expect(container.textContent).toContain(
        'Continue to Deposit USDC into your Perps Account',
      )
    },
  )
})
