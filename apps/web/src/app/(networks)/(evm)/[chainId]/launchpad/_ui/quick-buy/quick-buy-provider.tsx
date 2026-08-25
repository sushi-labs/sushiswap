'use client'

import { createErrorToast } from '@sushiswap/notifications'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { useAccount, useSwitchChain } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { EvmNative } from 'sushi/evm'
import { useChainId, useGasPrice } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { getQuickBuyNativeAmount } from '../../_lib/launchpad-swap'
import type { LaunchpadChainId } from '../../constants'
import type { LaunchpadToken } from '../../types'
import { QuickBuyTradeReview } from './quick-buy-trade-review'

type ExecuteQuickBuyInput = {
  token: LaunchpadToken
  usdAmount: number
  chainId: LaunchpadChainId
}

type QuickBuyRequest = ExecuteQuickBuyInput & {
  amount: string
}

type QuickBuyContextValue = {
  executeQuickBuy(input: ExecuteQuickBuyInput): Promise<void>
  pending: ExecuteQuickBuyInput | undefined
  request: QuickBuyRequest | undefined
}

const QuickBuyContext = createContext<QuickBuyContextValue | null>(null)

export function QuickBuyProvider({
  chainId,
  children,
}: {
  chainId: LaunchpadChainId
  children: ReactNode
}) {
  const [pending, setPending] = useState<ExecuteQuickBuyInput>()
  const [request, setRequest] = useState<QuickBuyRequest>()
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
  const { data: gasPrice, refetch: refetchGasPrice } = useGasPrice({
    chainId,
    query: { enabled: false },
  })
  const { open } = useSidebar()
  const { mutateAsync: switchChainAsync } = useSwitchChain({
    mutation: {
      onError: (error) => createErrorToast(error.message, false, 'perps'),
    },
  })

  const executeQuickBuy = useCallback(
    async (input: ExecuteQuickBuyInput) => {
      if (pending || request) return

      setPending(input)

      try {
        const { token, usdAmount, chainId: requestedChainId } = input

        if (!address) {
          open('connect', { namespace: 'evm', closeOnConnect: true })
          return
        }

        if (requestedChainId !== chainId || token.chainId !== chainId) {
          createErrorToast(
            'This token is not available on the selected network.',
            false,
            'perps',
          )
          return
        }

        if (activeChainId !== requestedChainId) {
          try {
            await switchChainAsync?.({ chainId: requestedChainId })
          } catch {
            return
          }
        }

        if (gasPrice === undefined) {
          const { data: loadedGasPrice } = await refetchGasPrice()
          if (loadedGasPrice === undefined) {
            createErrorToast(
              'Unable to load the current gas price for this quick buy.',
              false,
              'perps',
            )
            return
          }
        }

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

        setRequest({ ...input, amount: amount.toString() })
      } finally {
        setPending(undefined)
      }
    },
    [
      activeChainId,
      address,
      chainId,
      gasPrice,
      nativeBalance,
      nativeCurrency,
      nativePrice,
      open,
      pending,
      refetchGasPrice,
      request,
      switchChainAsync,
    ],
  )

  const closeQuickBuy = useCallback(() => {
    setRequest(undefined)
  }, [])

  const context = useMemo(
    () => ({ executeQuickBuy, pending, request }),
    [executeQuickBuy, pending, request],
  )

  return (
    <QuickBuyContext.Provider value={context}>
      {children}
      {request ? (
        <QuickBuyTradeReview
          token={request.token}
          amount={request.amount}
          onClose={closeQuickBuy}
        />
      ) : null}
    </QuickBuyContext.Provider>
  )
}

export function useQuickBuy(): QuickBuyContextValue {
  const context = useContext(QuickBuyContext)

  if (!context) {
    throw new Error('useQuickBuy must be used within a QuickBuyProvider')
  }

  return context
}
