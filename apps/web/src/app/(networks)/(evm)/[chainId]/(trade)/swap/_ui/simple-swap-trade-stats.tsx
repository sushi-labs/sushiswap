'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import React, { useEffect, useMemo, type FC } from 'react'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warning-severity'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { ZERO, formatUSD, getChainById, shortenAddress } from 'sushi'
import { type EvmAddress, EvmChainId, EvmNative, isEvmAddress } from 'sushi/evm'
import {
  type SvmChainId,
  SvmNative,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import { useDetailsInteractionTracker } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import { TradeStatRow } from '../../_ui/trade-stat-row'
import {
  TradeStats,
  TradeStatsSummary,
  TradeStatsToggle,
} from '../../_ui/trade-stats'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from './derivedstate-simple-swap-provider'
import { SimpleSwapTokenRate } from './simple-swap-token-rate'

function Recipient<TChainId extends EvmChainId | SvmChainId>({
  chainId,
  recipient,
}: { chainId: TChainId; recipient: AddressFor<TChainId> | undefined }) {
  const address = useAccount(chainId)
  const isMounted = useIsMounted()
  const hasValidRecipient = Boolean(
    recipient &&
      (isSvmChainId(chainId)
        ? isSvmAddress(recipient)
        : isEvmAddress(recipient)),
  )

  if (!recipient || !hasValidRecipient || !isMounted) {
    return null
  }

  return (
    <div className="flex justify-between items-center border-t border-accent mt-2 pt-2">
      <span className="text-sm text-muted-foreground">Recipient</span>
      <span className="text-right text-sm">
        <a
          target="_blank"
          href={getChainById(chainId as EvmChainId | SvmChainId).getAccountUrl(
            recipient as EvmAddress,
          )}
          className={classNames(
            address !== recipient ? 'text-yellow-600' : 'text-primary',
            'transition-all flex gap-1 items-center',
          )}
          rel="noreferrer"
        >
          {isSvmChainId(chainId) ? (
            <>{shortenAddress(recipient)}</>
          ) : (
            <AddressToEnsResolver address={recipient as EvmAddress}>
              {({ isLoading, data }) => {
                return (
                  <>{isLoading || !data ? shortenAddress(recipient) : data}</>
                )
              }}
            </AddressToEnsResolver>
          )}
          {address !== recipient && (
            <Explainer>
              Recipient is different from the connected wallet address. If this
              is expected, ignore this warning.
            </Explainer>
          )}
        </a>
      </span>
    </div>
  )
}

export const SimpleSwapTradeStats: FC = () => {
  const {
    state: { chainId, swapAmountString, recipient },
  } = useDerivedStateSimpleSwap()
  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()
  const { isLoading, data: quote } = useSimpleSwapTradeQuote()

  const loading = Boolean(isLoading && !quote)

  const isNoWay =
    quote?.route && 'status' in quote.route && quote?.route?.status === 'NoWay'
  const hasValidQuote = Boolean(+swapAmountString > 0 && !isNoWay)

  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) {
      // Auto-collapse details when quote becomes invalid and reset state
      resetDetailsTrackedState()
    }
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  const nativeSymbol = useMemo(() => {
    if (isSvmChainId(chainId)) {
      return SvmNative.fromChainId(chainId).symbol
    }
    return EvmNative.fromChainId(chainId).symbol
  }, [chainId])

  return (
    <TradeStats
      open={hasValidQuote && !isDetailsCollapsed}
      summary={
        <TradeStatsSummary
          rate={!hasValidQuote ? null : <SimpleSwapTokenRate />}
          showFees={hasValidQuote}
          isLoading={loading || !quote?.gasSpentUsd}
          fee={
            chainId === EvmChainId.SKALE_EUROPA
              ? 'FREE'
              : quote?.gasSpentUsd
                ? `${formatUSD(quote.gasSpentUsd)}`
                : null
          }
          feeClassName="gap-1"
          gasIconClassName="h-3"
        >
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={InterfaceEventName.SWAP_DETAILS_TOGGLE_CLICKED}
            element={InterfaceElementName.SWAP_DETAILS_TOGGLE}
            properties={{
              detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
              feeUsd: quote?.fee ? quote.fee : 'N/A',
              chainId,
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
        fontWeight="normal"
        valueClassName={warningSeverityClassName(
          warningSeverity(quote?.priceImpact),
        )}
      >
        {loading || !quote?.priceImpact ? (
          <SkeletonBox className="h-4 py-0.5 w-[40px]" />
        ) : quote?.priceImpact ? (
          `${
            quote?.priceImpact?.lt(ZERO)
              ? '+'
              : quote?.priceImpact?.gt(ZERO)
                ? '-'
                : ''
          }${Math.abs(Number(quote?.priceImpact?.toString({ fixed: 2 })))}%`
        ) : null}
      </TradeStatRow>

      <TradeStatRow title="Max. received" fontWeight="normal">
        {loading || !quote?.amountOut ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : (
          `${quote?.amountOut?.toSignificant(6) ?? '0.00'} ${
            quote?.amountOut?.currency?.symbol ?? ''
          }`
        )}
      </TradeStatRow>

      <TradeStatRow title="Min. received" fontWeight="normal">
        {loading || !quote?.minAmountOut ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          `${quote?.minAmountOut?.toSignificant(6) ?? '0.00'} ${
            quote?.amountOut?.currency?.symbol ?? ''
          }`
        )}
      </TradeStatRow>

      <TradeStatRow title="Fee" fontWeight="normal">
        {loading || !quote?.fee ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          `${quote?.fee}`
        )}
      </TradeStatRow>

      <TradeStatRow title="Network fee" fontWeight="normal">
        {chainId === EvmChainId.SKALE_EUROPA ? (
          'FREE'
        ) : loading || !quote?.gasSpent || quote.gasSpent === '0' ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : quote?.gasSpent ? (
          `${quote.gasSpent} ${nativeSymbol} ${
            quote?.gasSpentUsd ? `($${quote.gasSpentUsd})` : ''
          }`
        ) : null}
      </TradeStatRow>

      <TradeStatRow title="Routing source" fontWeight="normal">
        {loading || !quote ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : (
          'SushiSwap API'
        )}
      </TradeStatRow>

      <Recipient chainId={chainId} recipient={recipient} />
    </TradeStats>
  )
}
