'use client'

import { Button, List, SelectIcon } from '@sushiswap/ui'
import { type ReactNode, useId, useState } from 'react'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { formatUSD, getChainById, shortenAddress } from 'sushi'
import { SendAction, VerticalDivider } from '../lifi/route-view'
import type { LayerZeroTradeAmounts } from './get-trade-amounts'
import type { LayerZeroSourceNetworkFee } from './hooks/use-layerzero-source-network-fee'
import { SourceNetworkFee } from './source-network-fee'

export function LayerZeroTradeDetails({
  quote,
  amounts,
  sourceNetworkFee,
}: {
  quote: ValueTransferTrade
  amounts: LayerZeroTradeAmounts
  sourceNetworkFee: LayerZeroSourceNetworkFee
}): ReactNode {
  const [showMore, setShowMore] = useState(false)
  const detailsId = useId()
  const estimatedMinutes = quote.estimatedSeconds
    ? Math.max(1, Math.ceil(quote.estimatedSeconds / 60))
    : undefined

  return (
    <>
      <List>
        <List.Control>
          <List.KeyValue
            title="Estimated arrival"
            subtitle="Estimated time after sending. Actual arrival time may vary."
          >
            {estimatedMinutes
              ? `~${estimatedMinutes} minute${estimatedMinutes === 1 ? '' : 's'}`
              : 'Estimate unavailable'}
          </List.KeyValue>
          <List.KeyValue
            title="Protocol fees"
            subtitle="Total route fees, including native messaging fees. Source network gas is additional."
          >
            {formatUSD(Number(quote.quote.feeUsd))}
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
                title="Source native fee"
                subtitle="Included in the protocol fees above, paid in the source network's native currency."
              >
                {amounts.messagingFee.toSignificant(6)}{' '}
                {amounts.messagingFee.currency.symbol}
              </List.KeyValue>
              <List.KeyValue
                title="Min. received after slippage"
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
