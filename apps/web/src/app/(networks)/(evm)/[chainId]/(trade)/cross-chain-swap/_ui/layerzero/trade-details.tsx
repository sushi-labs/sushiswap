'use client'

import { Button, List, SelectIcon, SkeletonText } from '@sushiswap/ui'
import { type ReactNode, useId, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { getChainById, shortenAddress } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { SendAction, VerticalDivider } from '../lifi/route-view'
import type { LayerZeroTradeAmounts } from './get-trade-amounts'
import { useLayerZeroArrivalEstimate } from './hooks/use-layerzero-arrival-estimate'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'
import { SourceNetworkFee } from './source-network-fee'

export function LayerZeroTradeDetails({
  quote,
  amounts,
  sourceNetworkFee,
}: {
  quote: LayerZeroQuote
  amounts: LayerZeroTradeAmounts
  sourceNetworkFee: LayerZeroSourceNetworkFee
}): ReactNode {
  const [showMore, setShowMore] = useState(false)
  const [slippagePercent] = useSlippageTolerance()
  const detailsId = useId()
  const arrivalEstimate = useLayerZeroArrivalEstimate(
    quote.fromChainId,
    quote.toChainId,
  )
  const estimatedSeconds = arrivalEstimate.isError
    ? undefined
    : arrivalEstimate.data?.estimatedSeconds
  const estimatedMinutes = estimatedSeconds
    ? Math.ceil(estimatedSeconds / 60)
    : undefined
  const isFallbackEstimate =
    !estimatedSeconds && quote.fromChainId === StellarChainId.STELLAR

  return (
    <>
      <List>
        <List.Control>
          <List.KeyValue
            title="Estimated arrival"
            subtitle={
              isFallbackEstimate
                ? 'Approximate time after sending from Stellar. Actual arrival time may vary.'
                : 'Typical time after sending, based on recent transfers on these networks.'
            }
          >
            {arrivalEstimate.isLoading ? (
              <span aria-label="Loading arrival estimate">
                <SkeletonText
                  align="right"
                  fontSize="sm"
                  className="min-w-24"
                />
              </span>
            ) : estimatedMinutes ? (
              `~${estimatedMinutes} minute${estimatedMinutes === 1 ? '' : 's'}`
            ) : (
              <span>~30 minutes</span>
            )}
          </List.KeyValue>
          <List.KeyValue
            title="LayerZero fee"
            subtitle={
              showMore
                ? 'Includes a 10% buffer. Unused messaging fees are refunded.'
                : 'Source network gas is additional.'
            }
          >
            {amounts.messagingFee.toSignificant(6)}{' '}
            {amounts.messagingFee.currency.symbol}
          </List.KeyValue>
          <List.KeyValue
            title="Est. received"
            subtitle="The estimated output amount."
          >
            <span className="text-sm font-medium">
              {amounts.amountOut.toSignificant(6)}{' '}
              {amounts.amountOut.currency.symbol}
            </span>
          </List.KeyValue>
          {showMore ? (
            <div id={detailsId}>
              <List.KeyValue
                title="Network fee"
                subtitle="Additional to the LayerZero messaging fee. Final gas may vary; approval fees are separate."
              >
                <SourceNetworkFee
                  fee={sourceNetworkFee}
                  currency={amounts.messagingFee.currency}
                />
              </List.KeyValue>
              <List.KeyValue
                title="Protocol fee"
                subtitle="The token fee charged by the bridge provider."
              >
                {amounts.protocolFee.toSignificant(6)}{' '}
                {amounts.protocolFee.currency.symbol}
              </List.KeyValue>
              <List.KeyValue
                title={`Min. received after slippage (${slippagePercent.toPercentString()})`}
                subtitle="The minimum output enforced by this transfer."
              >
                <span className="text-sm font-medium">
                  {amounts.minimumAmountOut.toSignificant(6)}{' '}
                  {amounts.minimumAmountOut.currency.symbol}
                </span>
              </List.KeyValue>
            </div>
          ) : null}
          <div className="p-3">
            <Button
              size="xs"
              fullWidth
              variant="ghost"
              aria-label="Toggle review details"
              aria-expanded={showMore}
              aria-controls={detailsId}
              onClick={() => setShowMore((value) => !value)}
            >
              <SelectIcon className={showMore ? 'rotate-180' : undefined} />
            </Button>
          </div>
        </List.Control>
      </List>
      <List className="!pt-2">
        <List.Control className="!p-5">
          <div className="flex gap-4">
            <VerticalDivider count={2} className="pt-1.5 pl-1" />
            <div className="flex flex-col gap-8">
              <SendAction label="From" amount={amounts.amountIn} />
              <span className="inline-flex items-center gap-1 text-xs leading-3 text-muted-foreground whitespace-nowrap">
                Via <span className="font-semibold">LayerZero</span>
              </span>
              <SendAction label="To" amount={amounts.amountOut} />
            </div>
          </div>
        </List.Control>
      </List>
      {quote.recipient ? (
        <List className="!pt-2">
          <List.Control>
            <List.KeyValue title="Recipient">
              <a
                target="_blank"
                href={getChainById(quote.toChainId).getAccountUrl(
                  quote.recipient,
                )}
                className="flex items-center gap-2 cursor-pointer text-blue"
                rel="noreferrer"
              >
                {shortenAddress(quote.recipient)}
              </a>
            </List.KeyValue>
          </List.Control>
        </List>
      ) : null}
    </>
  )
}
