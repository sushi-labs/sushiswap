'use client'

import { createErrorToast } from '@sushiswap/notifications'
import { Button, DialogProvider } from '@sushiswap/ui'
import {
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { useAccount, useSwitchChain } from 'src/lib/wallet'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { Amount } from 'sushi'
import { EvmNative, EvmToken } from 'sushi/evm'
import { useChainId } from 'wagmi'
import { DetailsInteractionTrackerProvider } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '~evm/[chainId]/(trade)/swap/_ui/derivedstate-simple-swap-provider'
import { useEvmSimpleSwapTradeReview } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-trade-review-dialog/use-evm-simple-swap-trade-review'
import { defaultSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import {
  LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS,
  LAUNCHPAD_SWAP_FEE,
  QUICK_BUY_USD_AMOUNTS,
  getQuickBuyNativeAmount,
} from '../_lib/launchpad-swap'
import type { LaunchpadChainId } from '../constants'
import type { LaunchpadToken } from '../types'

type ExecuteQuickBuy = (
  token: LaunchpadToken,
  usdAmount: number,
) => Promise<void>

type QuickBuyTradeExecutorHandle = {
  execute(amount: string): Promise<void>
}

const QuickBuyContext = createContext<ExecuteQuickBuy | null>(null)

export function QuickBuyProvider({
  chainId,
  children,
}: {
  chainId: LaunchpadChainId
  children: ReactNode
}) {
  const [selectedToken, setSelectedToken] = useState<LaunchpadToken>()
  const executorRef = useRef<QuickBuyTradeExecutorHandle>(null)
  const isSubmittingRef = useRef(false)
  const address = useAccount('evm')
  const activeChainId = useChainId()
  const nativeCurrency = useMemo(
    () => EvmNative.fromChainId(chainId),
    [chainId],
  )
  const { data: nativeBalance } = useAmountBalance(nativeCurrency)
  const { data: nativePrice } = useCurrencyPrice({
    currency: nativeCurrency,
  })
  const { open } = useSidebar()
  const { mutateAsync: switchChainAsync } = useSwitchChain({
    mutation: {
      onError: (error) => createErrorToast(error.message, false, 'perps'),
    },
  })
  const runtimeRef = useRef({
    activeChainId,
    address,
    chainId,
    nativeBalance,
    nativeCurrency,
    nativePrice,
    open,
    switchChainAsync,
  })
  runtimeRef.current = {
    activeChainId,
    address,
    chainId,
    nativeBalance,
    nativeCurrency,
    nativePrice,
    open,
    switchChainAsync,
  }

  const executeQuickBuy = useCallback<ExecuteQuickBuy>(
    async (token, usdAmount) => {
      if (isSubmittingRef.current) return

      const runtime = runtimeRef.current
      if (!runtime.address) {
        runtime.open('connect', { namespace: 'evm', closeOnConnect: true })
        return
      }

      if (token.chainId !== runtime.chainId) {
        createErrorToast(
          'This token is not available on the selected network.',
          false,
          'perps',
        )
        return
      }

      if (runtime.activeChainId !== token.chainId) {
        try {
          await runtime.switchChainAsync?.({ chainId: token.chainId })
        } catch {
          return
        }
      }

      const { nativeBalance, nativeCurrency, nativePrice } = runtimeRef.current
      const amountString = getQuickBuyNativeAmount(
        usdAmount,
        nativePrice,
        nativeCurrency.decimals,
      )
      const amount = Amount.tryFromHuman(nativeCurrency, amountString ?? '')

      if (!amount) {
        createErrorToast(
          'Unable to load the current ETH price for this quick buy.',
          false,
          'perps',
        )
        return
      }

      if (!nativeBalance) {
        createErrorToast(
          'Unable to verify your ETH balance. Please try again.',
          false,
          'perps',
        )
        return
      }

      if (nativeBalance.lte(amount)) {
        createErrorToast(
          `You do not have enough ETH for this $${usdAmount} quick buy.`,
          false,
          'perps',
        )
        return
      }

      isSubmittingRef.current = true
      try {
        flushSync(() => setSelectedToken(token))
        const executor = executorRef.current
        if (!executor) {
          createErrorToast(
            'Unable to prepare this quick buy. Please try again.',
            false,
            'perps',
          )
          return
        }

        await executor.execute(amount.toString())
      } finally {
        isSubmittingRef.current = false
      }
    },
    [],
  )

  return (
    <QuickBuyContext.Provider value={executeQuickBuy}>
      {children}
      {selectedToken ? (
        <QuickBuyTradeController
          key={`${selectedToken.chainId}:${selectedToken.address}`}
          ref={executorRef}
          token={selectedToken}
        />
      ) : null}
    </QuickBuyContext.Provider>
  )
}

export function QuickBuy({ token }: { token: LaunchpadToken }) {
  const executeQuickBuy = useContext(QuickBuyContext)
  const [requestedUsdAmount, setRequestedUsdAmount] = useState<number>()

  if (!executeQuickBuy) {
    throw new Error('QuickBuy must be used within a QuickBuyProvider')
  }

  return (
    <div className="relative z-10">
      <div className="grid grid-cols-4 gap-2">
        {QUICK_BUY_USD_AMOUNTS.map((usdAmount) => (
          <Button
            key={usdAmount}
            type="button"
            size="xs"
            variant="perps-secondary"
            loading={requestedUsdAmount === usdAmount}
            disabled={requestedUsdAmount !== undefined}
            onClick={async (event) => {
              event.stopPropagation()
              setRequestedUsdAmount(usdAmount)
              try {
                await executeQuickBuy(token, usdAmount)
              } finally {
                setRequestedUsdAmount(undefined)
              }
            }}
            aria-label={`Quick buy $${usdAmount} of ${token.symbol} with ETH`}
            className="rounded-lg bg-white/[0.04] py-1.5 text-xs font-medium text-perps-muted-50 transition hover:bg-white/[0.08] hover:text-perps-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            ${usdAmount}
          </Button>
        ))}
      </div>
    </div>
  )
}

const QuickBuyTradeController = forwardRef<
  QuickBuyTradeExecutorHandle,
  { token: LaunchpadToken }
>(function QuickBuyTradeController({ token }, ref) {
  const nativeCurrency = useMemo(
    () => EvmNative.fromChainId(token.chainId),
    [token.chainId],
  )
  const launchCurrency = useMemo(
    () =>
      new EvmToken({
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
      }),
    [token.address, token.chainId, token.decimals, token.name, token.symbol],
  )

  return (
    <EdgeProvider config={defaultSwapEdgeConfig}>
      <CheckerProvider>
        <DerivedstateSimpleSwapProvider
          chainId={token.chainId}
          token0={nativeCurrency}
          token1={launchCurrency}
          persistToUrl={false}
          fee={LAUNCHPAD_SWAP_FEE}
          slippageToleranceOptions={LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS}
          directPool={{
            address: token.pool.address,
            quoteTokenAddress: token.pool.quoteToken.address,
            launchTokenAddress: token.address,
            feeTier: token.pool.feeTier,
          }}
        >
          <DetailsInteractionTrackerProvider>
            <Checker.Success tag={APPROVE_TAG_SWAP}>
              <DialogProvider>
                <QuickBuyTradeExecutor ref={ref} />
              </DialogProvider>
            </Checker.Success>
          </DetailsInteractionTrackerProvider>
        </DerivedstateSimpleSwapProvider>
      </CheckerProvider>
    </EdgeProvider>
  )
})

const QuickBuyTradeExecutor = forwardRef<QuickBuyTradeExecutorHandle>(
  function QuickBuyTradeExecutor(_props, ref) {
    const {
      mutate: { setSwapAmount },
    } = useDerivedStateSimpleSwap<LaunchpadChainId>()
    const tradeExecution = useEvmSimpleSwapTradeReview({ variant: 'perps' })
    const tradeExecutionRef = useRef(tradeExecution)
    tradeExecutionRef.current = tradeExecution

    useImperativeHandle(
      ref,
      () => ({
        async execute(amount: string) {
          try {
            flushSync(() => setSwapAmount(amount))
            const { data: trade, error } =
              await tradeExecutionRef.current.refetchTrade()

            if (!trade) {
              createErrorToast(
                error?.message || 'Unable to prepare this quick buy.',
                false,
                'perps',
              )
              return
            }

            await tradeExecutionRef.current.writeTrade(trade, () => {})
          } finally {
            setSwapAmount('')
          }
        },
      }),
      [setSwapAmount],
    )

    return null
  },
)
