'use client'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import {
  DialogContent,
  DialogFooter,
  DialogProvider,
  DialogReview,
} from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { useAccount } from 'src/lib/wallet'

import type { EvmAddress } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useExecuteCrossChainSwap } from '~stellar/_common/lib/hooks/swap'
import { parseSlippageTolerance } from '~stellar/_common/lib/utils/error-helpers'
import { requiresPriceImpactConfirmation } from '~stellar/_common/lib/utils/warning-severity'
import { ConfirmSwapButton } from './cross-chain-swap-trade-review-dialog/confirm-swap-button'
import { DialogBody } from './cross-chain-swap-trade-review-dialog/dialog-body'
import { RecipientSection } from './cross-chain-swap-trade-review-dialog/recipient-section'
import { ReviewIntro } from './cross-chain-swap-trade-review-dialog/review-intro'
import { TradeDetails } from './cross-chain-swap-trade-review-dialog/trade-details'
import { TradeHeader } from './cross-chain-swap-trade-review-dialog/trade-header'
import { TradeWarnings } from './cross-chain-swap-trade-review-dialog/trade-warnings'
import {
  useCrossChainTradeSwap,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

interface CrossChainSwapTradeReviewDialogProps {
  children: ReactNode
}

export function CrossChainSwapTradeReviewDialog({
  children,
}: CrossChainSwapTradeReviewDialogProps) {
  return (
    <DialogProvider>
      <CrossChainSwapTradeReviewDialogContent>
        {children}
      </CrossChainSwapTradeReviewDialogContent>
    </DialogProvider>
  )
}

function CrossChainSwapTradeReviewDialogContent({
  children,
}: {
  children: ReactNode
}) {
  const connectedAddress = useAccount('stellar')
  const { state, mutate } = useDerivedStateCrossChainSwap()
  const { token0, token1, swapAmountString, recipient } = state
  const { setSwapAmount } = mutate

  const executeCrossChainSwap = useExecuteCrossChainSwap()
  const [, { slippageTolerance }] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const { data: swapData } = useCrossChainTradeSwap()

  const amountIn = useMemo(() => {
    if (!swapAmountString || Number(swapAmountString) <= 0 || !token0) return 0n
    try {
      const [integer = '0', fraction = ''] = swapAmountString.split('.')
      const normalizedFraction = fraction
        .padEnd(token0.decimals, '0')
        .slice(0, token0.decimals)
      const digits =
        `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
      return BigInt(digits)
    } catch {
      return 0n
    }
  }, [swapAmountString, token0])

  const showSlippageWarning = useMemo(() => {
    const slippage = parseSlippageTolerance(slippageTolerance)
    return slippage > 20
  }, [slippageTolerance])

  const priceImpact = useMemo(() => {
    if (!swapData?.quote?.amountInUsd || !swapData?.quote?.amountOutUsd)
      return null
    const amountInUsd = Number(swapData.quote.amountInUsd)
    const amountOutUsd = Number(swapData.quote.amountOutUsd)
    if (amountInUsd <= 0) return null
    return ((amountInUsd - amountOutUsd) / amountInUsd) * 100
  }, [swapData])

  const showPriceImpactWarning = requiresPriceImpactConfirmation(
    priceImpact || undefined,
  )

  const handleSwap = useCallback(async () => {
    if (
      !connectedAddress ||
      !token0 ||
      !token1 ||
      !swapAmountString ||
      Number(swapAmountString) <= 0 ||
      !recipient ||
      !swapData?.quote?.depositAddress
    ) {
      return
    }

    const tokenOutAddress = token1.isNative
      ? zeroAddress
      : (token1.address as EvmAddress)

    try {
      await executeCrossChainSwap.mutateAsync({
        userAddress: connectedAddress,
        tokenIn: token0,
        tokenOut: {
          symbol: token1.symbol,
          decimals: token1.decimals,
          address: tokenOutAddress,
        },
        amountIn,
        depositAddress: swapData.quote.depositAddress,
        recipient: recipient as EvmAddress,
        correlationId: swapData.correlationId,
      })

      setSwapAmount('')
    } catch (error) {
      console.error('Error executing cross-chain swap:', error)
    }
  }, [
    connectedAddress,
    token0,
    token1,
    swapAmountString,
    recipient,
    swapData,
    amountIn,
    executeCrossChainSwap,
    setSwapAmount,
  ])

  const write = useCallback(
    async (confirm: () => void) => {
      await handleSwap()
      confirm()
    },
    [handleSwap],
  )

  const isWritePending = executeCrossChainSwap.isPending
  const isEstGasError = false
  const isStepQueryError = false
  const estGasError: Error | null = null

  return (
    <DialogReview>
      {({ confirm }) => (
        <>
          <ReviewIntro estGasError={estGasError}>{children}</ReviewIntro>
          <DialogContent className="max-h-[80vh]">
            <TradeHeader />
            <DialogBody>
              <TradeWarnings
                showSlippageWarning={showSlippageWarning}
                showPriceImpactWarning={showPriceImpactWarning}
              />
              <TradeDetails />
              <RecipientSection />
            </DialogBody>
            <DialogFooter>
              <ConfirmSwapButton
                confirm={confirm}
                write={write}
                isWritePending={isWritePending}
                isEstGasError={isEstGasError}
                isStepQueryError={isStepQueryError}
                showPriceImpactWarning={showPriceImpactWarning}
                showSlippageWarning={showSlippageWarning}
              />
            </DialogFooter>
          </DialogContent>
        </>
      )}
    </DialogReview>
  )
}
