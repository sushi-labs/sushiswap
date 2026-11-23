'use client'

import { List } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { ReviewAmountValue } from 'src/lib/components/review-amount-value'
import { ReviewDetailRow } from 'src/lib/components/review-detail-row'
import { useAmountUsd } from 'src/lib/hooks/use-amount-usd'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { formatUSD } from 'sushi'
import { RecipientSection } from '../../../swap/_ui/simple-swap-trade-review-dialog/recipient-section'
import { TradeAmounts } from '../../../swap/_ui/simple-swap-trade-review-dialog/trade-amounts'
import { CrossChainSwapRouteView } from '../lifi/route-view'
import type { LayerZeroTradeAmounts } from './get-trade-amounts'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'
import { SourceNetworkFee } from './source-network-fee'

export function LayerZeroTradeDetails({
  quote,
  amounts,
  sourceNetworkFee,
  isLoading,
}: {
  quote: ValueTransferTrade
  amounts: LayerZeroTradeAmounts
  sourceNetworkFee: LayerZeroSourceNetworkFee
  isLoading?: boolean
}): ReactNode {
  const [slippagePercent] = useSlippageTolerance()
  const messagingFeeUSD = useAmountUsd({ amount: amounts.messagingFee })
  const minimumAmountOutUSD =
    Number(quote.quote.dstAmountUsd) *
    (Number(quote.minAmountOut) / Number(quote.amountOut))
  const estimatedMinutes = quote.estimatedSeconds
    ? Math.max(1, Math.ceil(quote.estimatedSeconds / 60))
    : undefined

  return (
    <>
      <div className="flex flex-col gap-2">
        <TradeAmounts
          amountIn={amounts.amountIn}
          amountOut={amounts.amountOut}
          amountInUSD={quote.quote.srcAmountUsd}
          amountOutUSD={quote.quote.dstAmountUsd}
          isLoading={isLoading}
        />
        <List className="!pt-0 !gap-0">
          <List.Control className="!border-transparent !bg-transparent !px-0">
            <ReviewDetailRow
              title="Slippage tolerance"
              explanation="The percentage of slippage you are willing to accept. Slippage is the difference between the expected price and the actual price at which the trade is executed."
            >
              {slippagePercent.toPercentString()}
            </ReviewDetailRow>
            <ReviewDetailRow
              title="Minimum received"
              explanation="The minimum output enforced by this transfer."
            >
              <ReviewAmountValue usdValue={minimumAmountOutUSD}>
                {amounts.minimumAmountOut.toSignificant(6)}{' '}
                {amounts.minimumAmountOut.currency.symbol}
              </ReviewAmountValue>
            </ReviewDetailRow>
            <ReviewDetailRow
              title="Network fee"
              explanation="Additional to the LayerZero messaging fee. Final gas may vary; approval fees are separate."
            >
              <SourceNetworkFee
                fee={sourceNetworkFee}
                currency={amounts.messagingFee.currency}
                display="review"
              />
            </ReviewDetailRow>
            <ReviewDetailRow
              title="Protocol fees"
              explanation="Total route fees, including native messaging fees. Source network gas is additional."
            >
              {formatUSD(Number(quote.quote.feeUsd))}
            </ReviewDetailRow>
            <ReviewDetailRow
              title="Source native fee"
              explanation="Included in the protocol fees above, paid in the source network's native currency."
            >
              <ReviewAmountValue
                usdValue={messagingFeeUSD.data}
                isUsdLoading={messagingFeeUSD.isLoading}
              >
                {amounts.messagingFee.toSignificant(6)}{' '}
                {amounts.messagingFee.currency.symbol}
              </ReviewAmountValue>
            </ReviewDetailRow>
            <ReviewDetailRow
              title="Estimated arrival"
              explanation="Estimated time after sending. Actual arrival time may vary."
            >
              {estimatedMinutes
                ? `~${estimatedMinutes} minute${estimatedMinutes === 1 ? '' : 's'}`
                : 'Estimate unavailable'}
            </ReviewDetailRow>
          </List.Control>
        </List>
      </div>
      <List className="!pt-0">
        <List.Control className="!bg-transparent !rounded-2xl !p-5">
          <CrossChainSwapRouteView
            amountIn={amounts.amountIn}
            amountOut={amounts.amountOut}
            provider="LayerZero"
          />
        </List.Control>
      </List>
      <RecipientSection chainId={quote.toChainId} recipient={quote.recipient} />
    </>
  )
}
