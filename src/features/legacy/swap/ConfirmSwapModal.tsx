import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent, TradeVersion } from '@sushiswap/core-sdk'
import { toAmountCurrencyAmount } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import useBentoRebases from 'app/hooks/useBentoRebases'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'app/modals/TransactionConfirmationModal'
import { TradeUnion } from 'app/types'
import React, { FC, useMemo } from 'react'

import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
function tradeMeaningfullyDiffers(...args: [TradeUnion, TradeUnion]): boolean {
  const [tradeA, tradeB] = args
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface ConfirmSwapModal {
  isOpen: boolean
  trade?: TradeUnion
  originalTrade?: TradeUnion
  attemptingTxn: boolean
  allowedSlippage: Percent
  onAcceptChanges(): void
  onConfirm(): void
  onDismiss(): void
  txHash?: string
  recipient?: string
  swapErrorMessage?: string
}

const ConfirmSwapModal: FC<ConfirmSwapModal> = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}) => {
  const { i18n } = useLingui()
  const { rebases, loading } = useBentoRebases([trade?.inputAmount.currency, trade?.outputAmount.currency])
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const [inputAmount, outputAmount, maximumAmountIn, minimumAmountOut] = useMemo(() => {
    if (getTradeVersion(trade) === TradeVersion.V2TRADE)
      return [
        trade?.inputAmount,
        trade?.outputAmount,
        trade?.maximumAmountIn(allowedSlippage),
        trade?.minimumAmountOut(allowedSlippage),
      ]

    if (loading) return [undefined, undefined, undefined, undefined]

    const rebaseInput = trade?.inputAmount.currency.wrapped.address
      ? rebases[trade.inputAmount.currency.wrapped.address]
      : undefined
    const rebaseOutput = trade?.outputAmount.currency.wrapped.address
      ? rebases[trade.outputAmount.currency.wrapped.address]
      : undefined

    return [
      trade?.inputAmount && !!rebaseInput ? toAmountCurrencyAmount(rebaseInput, trade.inputAmount.wrapped) : undefined,
      trade?.outputAmount && !!rebaseOutput
        ? toAmountCurrencyAmount(rebaseOutput, trade.outputAmount.wrapped)
        : undefined,
      trade?.maximumAmountIn(allowedSlippage) && !!rebaseInput
        ? toAmountCurrencyAmount(rebaseInput, trade?.maximumAmountIn(allowedSlippage).wrapped)
        : undefined,
      trade?.minimumAmountOut(allowedSlippage) && !!rebaseOutput
        ? toAmountCurrencyAmount(rebaseOutput, trade?.minimumAmountOut(allowedSlippage).wrapped)
        : undefined,
    ]
  }, [allowedSlippage, loading, rebases, trade])

  const pendingText = `Swapping ${inputAmount?.toSignificant(6)} ${
    inputAmount?.currency?.symbol
  } for ${outputAmount?.toSignificant(6)} ${outputAmount?.currency?.symbol}`

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={
        swapErrorMessage ? (
          <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
        ) : (
          <ConfirmationModalContent
            title={i18n._(t`Confirm Swap`)}
            onDismiss={onDismiss}
            topContent={
              <SwapModalHeader
                trade={trade}
                recipient={recipient}
                showAcceptChanges={showAcceptChanges}
                onAcceptChanges={onAcceptChanges}
                inputAmount={inputAmount}
                outputAmount={outputAmount}
                maximumAmountIn={maximumAmountIn}
                minimumAmountOut={minimumAmountOut}
              />
            }
            bottomContent={
              <SwapModalFooter
                onConfirm={onConfirm}
                disabledConfirm={showAcceptChanges}
                swapErrorMessage={swapErrorMessage}
              />
            }
          />
        )
      }
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}

export default ConfirmSwapModal
