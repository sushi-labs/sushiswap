'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Explainer, SkeletonBox, classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import {
  NEAR_INTENTS_UI_FEE_DECIMAL,
  NEAR_INTENTS_UI_FEE_PERCENT,
} from 'src/lib/swap/near-intents'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { Amount, Price, formatUSD, getChainById, shortenAddress } from 'sushi'
import { type EvmAddress, isEvmAddress } from 'sushi/evm'
import {
  type StellarAccountAddress,
  isStellarAccountAddress,
  isStellarChainId,
} from 'sushi/stellar'
import { getStellarAddressLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
import { TokenRate } from '../../../_ui/token-rate'
import { TradeStatRow } from '../../../_ui/trade-stat-row'
import {
  TradeStats,
  TradeStatsSummary,
  TradeStatsToggle,
} from '../../../_ui/trade-stats'
import { useNearIntentsSourceNetworkFee } from './hooks/use-near-intents-source-network-fee'
import { useNearIntentsXSwap } from './xswap-provider'

export function NearIntentsCrossChainSwapTradeStats() {
  const {
    state: { chainId0, chainId1, swapAmount, swapAmountString, token0, token1 },
    previewQuote,
    executionStatus,
  } = useNearIntentsXSwap()
  const {
    state: { isDetailsCollapsed },
    mutate: {
      setIsDetailsCollapsed,
      setWasDetailsTouched,
      resetDetailsTrackedState,
    },
  } = useDetailsInteractionTracker()

  const quote = previewQuote.data
  const hasValidQuote = Boolean(+swapAmountString > 0 && !previewQuote.error)
  const isLoading = hasValidQuote && (previewQuote.isLoading || !quote)

  useEffect(() => {
    if (!hasValidQuote && !isDetailsCollapsed) {
      resetDetailsTrackedState()
    }
  }, [hasValidQuote, isDetailsCollapsed, resetDetailsTrackedState])

  const status = executionStatus.data?.status
  const recipient = useAccount(chainId1)
  const { amountInUsd, amountOut, amountOutUsd, minAmountOut } =
    quote?.quote ?? {}
  const networkFee = useNearIntentsSourceNetworkFee({
    amountIn: quote?.quote.amountIn,
    chainId: chainId0,
    enabled: hasValidQuote,
    token: token0,
  })
  const outputAmount =
    token1 && amountOut ? new Amount(token1, amountOut) : null
  const minimumOutputAmount =
    token1 && minAmountOut ? new Amount(token1, minAmountOut) : null
  const feeUsd = quote
    ? Number(amountInUsd) * NEAR_INTENTS_UI_FEE_DECIMAL
    : undefined
  const feeLabel = `Fee (${NEAR_INTENTS_UI_FEE_PERCENT}%)`

  const networkFeeLabel =
    networkFee.amountUsd === undefined ? 'N/A' : formatUSD(networkFee.amountUsd)

  return (
    <TradeStats
      open={hasValidQuote && !isDetailsCollapsed}
      summary={
        <TradeStatsSummary
          rate={
            !hasValidQuote ? null : (
              <NearIntentsCrossChainSwapTokenRate
                amountInUsd={amountInUsd}
                amountOutUsd={amountOutUsd}
                isLoading={isLoading}
                outputAmount={outputAmount}
                swapAmount={swapAmount}
              />
            )
          }
          showFees={hasValidQuote}
          isLoading={isLoading || networkFee.isLoading}
          fee={networkFeeLabel}
        >
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={InterfaceEventName.XSWAP_DETAILS_TOGGLE_CLICKED}
            element={InterfaceElementName.XSWAP_DETAILS_TOGGLE}
            properties={{
              detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
              feeUsd: networkFee.amountUsd ?? 'N/A',
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
      <TradeStatRow title="Est. received">
        {isLoading || !outputAmount ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : (
          `${outputAmount.toSignificant(6)} ${token1?.symbol ?? ''}`
        )}
      </TradeStatRow>

      <TradeStatRow title="Min. received">
        {isLoading || !minimumOutputAmount ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          `${minimumOutputAmount.toSignificant(6)} ${token1?.symbol ?? ''}`
        )}
      </TradeStatRow>

      <TradeStatRow title={feeLabel}>
        {isLoading || feeUsd === undefined ? (
          <SkeletonBox className="h-4 py-0.5 w-[100px]" />
        ) : (
          formatUSD(feeUsd)
        )}
      </TradeStatRow>

      <TradeStatRow title="Network fee">
        {isLoading || networkFee.isLoading ? (
          <SkeletonBox className="h-4 py-0.5 w-[120px]" />
        ) : networkFee.amount && networkFee.symbol ? (
          `${networkFee.amount} ${networkFee.symbol} (${networkFeeLabel})`
        ) : (
          networkFeeLabel
        )}
      </TradeStatRow>

      <TradeStatRow title="Est. arrival">
        {isLoading ? (
          <SkeletonBox className="h-4 py-0.5 w-[80px]" />
        ) : (
          (previewQuote.executionDuration ?? 'N/A')
        )}
      </TradeStatRow>

      {status ? (
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
          <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
            Status
          </span>
          <span className="font-semibold text-right">{status}</span>
        </div>
      ) : null}
      <Recipient chainId={chainId1} recipient={recipient} />
    </TradeStats>
  )
}

function Recipient({
  chainId,
  recipient,
}: {
  chainId: NearIntentsSupportedChainId
  recipient: AddressFor<NearIntentsSupportedChainId> | undefined
}) {
  const address = useAccount(chainId)
  const isStellar = isStellarChainId(chainId)
  const isValidRecipient = Boolean(
    recipient &&
      (isStellar
        ? isStellarAccountAddress(recipient)
        : isEvmAddress(recipient)),
  )

  if (!recipient || !isValidRecipient) {
    return null
  }

  const href = isStellar
    ? getStellarAddressLink(recipient as StellarAccountAddress)
    : getChainById(chainId).getAccountUrl(recipient as EvmAddress)

  return (
    <div className="flex justify-between items-center border-t border-accent mt-2 pt-2">
      <span className="text-sm text-muted-foreground">Recipient</span>
      <span className="text-right text-sm">
        <a
          target="_blank"
          href={href}
          className={classNames(
            address !== recipient ? 'text-yellow-600' : 'text-primary',
            'transition-all flex gap-1 items-center',
          )}
          rel="noreferrer"
        >
          {isStellar ? (
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

function NearIntentsCrossChainSwapTokenRate({
  amountInUsd,
  amountOutUsd,
  isLoading,
  outputAmount,
  swapAmount,
}: {
  amountInUsd: string | undefined
  amountOutUsd: string | undefined
  isLoading: boolean
  outputAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | null
  swapAmount: Amount<CurrencyFor<NearIntentsSupportedChainId>> | undefined
}) {
  const [invert, setInvert] = useState(false)
  const price = useMemo(() => {
    if (!swapAmount || !outputAmount) return undefined

    const quotePrice = new Price({
      baseAmount: swapAmount,
      quoteAmount: outputAmount,
    })

    return invert
      ? quotePrice.invert().toString({ fixed: 6 })
      : quotePrice.toString({ fixed: 6 })
  }, [invert, outputAmount, swapAmount])

  return (
    <TokenRate
      baseSymbol={
        invert ? swapAmount?.currency.symbol : outputAmount?.currency.symbol
      }
      quoteSymbol={
        invert ? outputAmount?.currency.symbol : swapAmount?.currency.symbol
      }
      rate={price}
      fiatValue={formatUSD(Number(invert ? amountInUsd : amountOutUsd) || 0)}
      isLoading={isLoading || !swapAmount || !outputAmount || !price}
      onInvert={() => setInvert((prev) => !prev)}
    />
  )
}
