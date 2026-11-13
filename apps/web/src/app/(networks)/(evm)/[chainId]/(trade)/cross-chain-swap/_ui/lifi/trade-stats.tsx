'use client'

import { Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import { ZERO, formatUSD, getChainById, shortenAddress } from 'sushi'
import { isAddress } from 'viem'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  EVM_UI_FEE_PERCENT,
  type LifiXSwapSupportedChainId,
  XSWAP_STABLE_UI_FEE_PERCENT,
  XSWAP_SUSHI_UI_FEE_PERCENT,
} from 'src/config'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warning-severity'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
import { TradeStatRow } from '../../../_ui/trade-stat-row'
import {
  TradeStats,
  TradeStatsSummary,
  TradeStatsToggle,
} from '../../../_ui/trade-stats'
import { CrossChainSwapFeesHoverCard } from './fees-hover-card'
import { CrossChainSwapTokenRate } from './token-rate'
import { useLifiXSwap, useLifiXSwapSelectedTradeRoute } from './xswap-provider'

export function CrossChainSwapTradeStats<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const {
    state: {
      chainId0,
      chainId1,
      isStableToStable,
      swapAmountString,
      recipient,
      isSushiToSushi,
    },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const { isLoading, data: trade, isError } = useLifiXSwapSelectedTradeRoute()
  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()
  const hasValidQuote = Boolean(+swapAmountString > 0 && !isError)
  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) {
      // Auto-collapse details when quote becomes invalid and reset state
      resetDetailsTrackedState()
    }
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  const address = useAccount(chainId1)

  const feeData = useMemo(
    () => (trade?.step ? getCrossChainFeesBreakdown(trade.step) : undefined),
    [trade?.step],
  )

  return (
    <TradeStats
      open={hasValidQuote && !isDetailsCollapsed}
      summary={
        <TradeStatsSummary
          rate={!hasValidQuote ? null : <CrossChainSwapTokenRate />}
          showFees={hasValidQuote}
          isLoading={isLoading || !feeData}
          fee={formatUSD(feeData?.gasFeesUSD ?? 0)}
        >
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={InterfaceEventName.XSWAP_DETAILS_TOGGLE_CLICKED}
            element={InterfaceElementName.XSWAP_DETAILS_TOGGLE}
            properties={{
              detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
              feeUsd: feeData?.uiFeesUSD ? feeData?.uiFeesUSD : 'N/A',
              chainId0,
              chainId1,
            }}
          >
            <TradeStatsToggle
              collapsed={isDetailsCollapsed}
              onClick={() => {
                setIsDetailsCollapsed(!isDetailsCollapsed)
                setWasDetailsTouched(true)
              }}
            />
          </TraceEvent>
        </TradeStatsSummary>
      }
    >
      <TradeStatRow
        title="Price impact"
        valueClassName={warningSeverityClassName(
          warningSeverity(trade?.priceImpact),
        )}
      >
        {isLoading ? (
          <SkeletonBox className="h-4 py-0.5 w-[40px]" />
        ) : trade?.priceImpact ? (
          `${
            trade?.priceImpact?.lt(ZERO)
              ? '+'
              : trade?.priceImpact?.gt(ZERO)
                ? '-'
                : ''
          }${Math.abs(Number((trade?.priceImpact?.toNumber() * 100).toFixed(2)))}%`
        ) : (
          'Unavailable'
        )}
      </TradeStatRow>

      <TradeStatRow title="Est. received">
        {isLoading || !trade?.amountOut ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : (
          `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${
            trade?.amountOut?.currency?.symbol ?? ''
          }`
        )}
      </TradeStatRow>

      <TradeStatRow title="Min. received">
        {isLoading || !trade?.amountOutMin ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          `${trade?.amountOutMin?.toSignificant(6) ?? '0.00'} ${
            trade?.amountOut?.currency?.symbol ?? ''
          }`
        )}
      </TradeStatRow>

      <TradeStatRow
        title={
          <>
            Fee (
            {isSushiToSushi
              ? XSWAP_SUSHI_UI_FEE_PERCENT
              : isStableToStable
                ? XSWAP_STABLE_UI_FEE_PERCENT
                : EVM_UI_FEE_PERCENT}
            %)
          </>
        }
      >
        {isLoading || !feeData ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          `${formatUSD(feeData.uiFeesUSD)}`
        )}
      </TradeStatRow>

      <TradeStatRow title="Network fee">
        {isLoading || !feeData ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : (
          <CrossChainSwapFeesHoverCard
            feesBreakdown={feeData.feesBreakdown}
            gasFeesUSD={feeData.gasFeesUSD}
            protocolFeesUSD={feeData.protocolFeesUSD}
            chainId0={chainId0}
            chainId1={chainId1}
          >
            <span className="underline decoration-dotted underline-offset-4 flex items-center justify-end gap-1 text-sm">
              {formatUSD(feeData.totalFeesUSD)}
            </span>
          </CrossChainSwapFeesHoverCard>
        )}
      </TradeStatRow>

      {recipient && isAddress(recipient) && (
        <div className="flex justify-between items-center border-t border-accent mt-2 pt-2">
          <span className="text-sm text-muted-foreground">Recipient</span>
          <span className="text-right text-sm">
            <a
              target="_blank"
              href={getChainById(
                chainId1 as LifiXSwapSupportedChainId,
              ).getAccountUrl(recipient)}
              className={classNames(
                address !== recipient ? 'text-yellow-600' : 'text-primary',
                'transition-all flex gap-1 items-center',
              )}
              rel="noreferrer"
            >
              <AddressToEnsResolver address={recipient}>
                {({ isLoading, data }) => {
                  return (
                    <>{isLoading || !data ? shortenAddress(recipient) : data}</>
                  )
                }}
              </AddressToEnsResolver>
              {address !== recipient && (
                <Explainer>
                  Recipient is different from the connected wallet address. If
                  this is expected, ignore this warning.
                </Explainer>
              )}
            </a>
          </span>
        </div>
      )}
    </TradeStats>
  )
}
