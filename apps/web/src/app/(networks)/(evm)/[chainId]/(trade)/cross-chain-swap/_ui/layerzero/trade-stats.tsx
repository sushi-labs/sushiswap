'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Explainer, SkeletonText, classNames } from '@sushiswap/ui'
import { type ReactNode, useEffect, useId, useMemo, useState } from 'react'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Price, formatUSD, getChainById, shortenAddress } from 'sushi'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
import { TokenRate } from '../../../_ui/token-rate'
import { TradeStatRow } from '../../../_ui/trade-stat-row'
import {
  TradeStats,
  TradeStatsSummary,
  TradeStatsToggle,
} from '../../../_ui/trade-stats'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import { SourceNetworkFee } from './source-network-fee'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroTradeStats(): ReactNode {
  const {
    state: { chainId0, chainId1, swapAmount, isUnsupportedPair },
    previewQuote,
    sourceNetworkFee,
  } = useLayerZeroXSwap()
  const address = useAccount(chainId1)

  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()
  const [invert, setInvert] = useState(false)
  const detailsId = useId()
  const hasValidQuote = Boolean(
    swapAmount?.gt(0n) &&
      !previewQuote.error &&
      !isUnsupportedPair &&
      previewQuote.data !== null,
  )
  const amounts = useMemo(
    () =>
      previewQuote.data
        ? getLayerZeroTradeAmounts(previewQuote.data)
        : undefined,
    [previewQuote.data],
  )
  const price = useMemo(() => {
    if (!amounts?.amountIn.gt(0n) || !amounts.amountOut.gt(0n)) return undefined
    const rate = new Price({
      baseAmount: amounts.amountIn,
      quoteAmount: amounts.amountOut,
    })
    return (invert ? rate.invert() : rate).toString({ fixed: 6 })
  }, [amounts, invert])
  const recipient = previewQuote.data?.recipient

  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) resetDetailsTrackedState()
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  if (!hasValidQuote) return null
  if (previewQuote.isLoading || !amounts || !price) {
    return (
      <TradeStatsSummary
        rate={<SkeletonText fontSize="sm" className="!w-[100px]" />}
        isLoading
        className=""
        aria-label="Loading swap details"
      />
    )
  }

  const messagingFee = `${amounts.messagingFee.toSignificant(6)} ${amounts.messagingFee.currency.symbol}`

  return (
    <TradeStats
      open={!isDetailsCollapsed}
      detailsId={detailsId}
      summary={
        <TradeStatsSummary
          className="flex-wrap"
          feeClassName="ml-auto gap-0.5"
          rate={
            <TokenRate
              baseSymbol={
                invert
                  ? amounts.amountOut.currency.symbol
                  : amounts.amountIn.currency.symbol
              }
              quoteSymbol={
                invert
                  ? amounts.amountIn.currency.symbol
                  : amounts.amountOut.currency.symbol
              }
              rate={price}
              aria-label="Invert exchange rate"
              onInvert={() => setInvert((value) => !value)}
            />
          }
          fee={
            <SourceNetworkFee
              fee={sourceNetworkFee}
              currency={amounts.messagingFee.currency}
              display="usd"
            />
          }
        >
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={InterfaceEventName.XSWAP_DETAILS_TOGGLE_CLICKED}
            element={InterfaceElementName.XSWAP_DETAILS_TOGGLE}
            properties={{
              detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
              chainId0,
              chainId1,
            }}
          >
            <TradeStatsToggle
              collapsed={isDetailsCollapsed}
              detailsId={detailsId}
              onClick={() => {
                setIsDetailsCollapsed(!isDetailsCollapsed)
                setWasDetailsTouched(true)
              }}
            />
          </TraceEvent>
        </TradeStatsSummary>
      }
    >
      <TradeStatRow title="Est. received">
        {amounts.amountOut.toSignificant(6)} {amounts.amountOut.currency.symbol}
      </TradeStatRow>
      <TradeStatRow title="Min. received">
        {amounts.minimumAmountOut.toSignificant(6)}{' '}
        {amounts.minimumAmountOut.currency.symbol}
      </TradeStatRow>
      <TradeStatRow title="Protocol fees">
        {previewQuote.data
          ? formatUSD(Number(previewQuote.data.quote.feeUsd))
          : 'N/A'}
      </TradeStatRow>
      <TradeStatRow
        title={
          <>
            Source native fee{' '}
            <Explainer>
              Included in the total protocol fees above. Source network gas is
              additional.
            </Explainer>
          </>
        }
      >
        {messagingFee}
      </TradeStatRow>
      <TradeStatRow title="Network fee">
        <SourceNetworkFee
          fee={sourceNetworkFee}
          currency={amounts.messagingFee.currency}
          display="usd"
        />
      </TradeStatRow>
      <TradeStatRow title="Provider">LayerZero</TradeStatRow>
      {recipient ? (
        <div className="flex justify-between items-center border-t border-accent mt-2 pt-2">
          <span className="text-sm text-muted-foreground">Recipient</span>
          <a
            href={getChainById(chainId1).getAccountUrl(recipient)}
            target="_blank"
            rel="noreferrer"
            className={classNames(
              address !== recipient ? 'text-yellow-600' : 'text-primary',
              'transition-all flex gap-1 items-center',
            )}
          >
            {shortenAddress(recipient)}
          </a>
        </div>
      ) : null}
    </TradeStats>
  )
}
