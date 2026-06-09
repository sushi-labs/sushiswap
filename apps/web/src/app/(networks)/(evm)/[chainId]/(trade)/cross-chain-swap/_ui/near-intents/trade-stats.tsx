'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import {
  Button,
  Collapsible,
  Explainer,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import { useEffect, useMemo, useState } from 'react'
import {
  NEAR_INTENTS_UI_FEE_DECIMAL,
  NEAR_INTENTS_UI_FEE_PERCENT,
} from 'src/lib/swap/near-intents'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/address-to-ens-resolver'
import { useAccount } from 'src/lib/wallet'
import { Amount, Price, formatUSD, getChainById, shortenAddress } from 'sushi'
import { type EvmAddress, isEvmAddress } from 'sushi/evm'
import {
  type StellarAccountAddress,
  isStellarAccountAddress,
  isStellarChainId,
} from 'sushi/stellar'
import { getStellarAddressLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
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
    <>
      <div className="flex items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        {!hasValidQuote ? null : (
          <NearIntentsCrossChainSwapTokenRate
            amountInUsd={amountInUsd}
            amountOutUsd={amountOutUsd}
            isLoading={isLoading}
            outputAmount={outputAmount}
            swapAmount={swapAmount}
          />
        )}

        {!hasValidQuote ? null : isLoading || networkFee.isLoading ? (
          <div className="flex items-center gap-0.5">
            <SkeletonText fontSize="sm" className="!w-[60px]" />
            <SkeletonCircle radius={26} />
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'text-xs font-medium flex items-center transition-opacity',
                isDetailsCollapsed ? 'opacity-100' : 'opacity-0',
              )}
            >
              <GasIcon className="inline-block w-3 h-4 mr-0.5" />
              {networkFeeLabel}
            </div>
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
              <IconButton
                icon={ChevronDownIcon}
                size="xs"
                name="Toggle Swap Details"
                onClick={() => {
                  setIsDetailsCollapsed(!isDetailsCollapsed)
                  setWasDetailsTouched(true)
                }}
                className={classNames(
                  isDetailsCollapsed ? '' : 'rotate-180',
                  'transition-transform',
                )}
                variant="ghost"
              />
            </TraceEvent>
          </div>
        )}
      </div>
      <Collapsible open={hasValidQuote && !isDetailsCollapsed}>
        <div className="pt-2 w-full flex flex-col gap-1">
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Est. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !outputAmount ? (
                <SkeletonBox className="h-4 py-0.5 w-[120px]" />
              ) : (
                `${outputAmount.toSignificant(6)} ${token1?.symbol ?? ''}`
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Min. received
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || !minimumOutputAmount ? (
                <SkeletonBox className="h-4 py-0.5 w-[100px]" />
              ) : (
                `${minimumOutputAmount.toSignificant(6)} ${token1?.symbol ?? ''}`
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              {feeLabel}
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || feeUsd === undefined ? (
                <SkeletonBox className="h-4 py-0.5 w-[100px]" />
              ) : (
                formatUSD(feeUsd)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Network fee
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading || networkFee.isLoading ? (
                <SkeletonBox className="h-4 py-0.5 w-[120px]" />
              ) : networkFee.amount && networkFee.symbol ? (
                `${networkFee.amount} ${networkFee.symbol} (${networkFeeLabel})`
              ) : (
                networkFeeLabel
              )}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-slate-400">
              Est. arrival
            </span>
            <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
              {isLoading ? (
                <SkeletonBox className="h-4 py-0.5 w-[80px]" />
              ) : (
                (previewQuote.executionDuration ?? 'N/A')
              )}
            </span>
          </div>

          {status ? (
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
              <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
                Status
              </span>
              <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
                {status}
              </span>
            </div>
          ) : null}
          <Recipient chainId={chainId1} recipient={recipient} />
        </div>
      </Collapsible>
    </>
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
    <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
      <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
        Recipient
      </span>
      <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
        <a
          target="_blank"
          href={href}
          className={classNames(
            address !== recipient
              ? 'text-yellow-600'
              : 'text-gray-700 dark:text-slate-300',
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

  if (isLoading || !swapAmount || !outputAmount || !price) {
    return <SkeletonText fontSize="sm" className="!w-[100px]" />
  }

  return (
    <Button
      className="!text-xs !font-medium !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
      variant="ghost"
      size="xs"
      onClick={() => setInvert((prev) => !prev)}
    >
      1 {invert ? swapAmount.currency.symbol : outputAmount.currency.symbol} ={' '}
      {price}{' '}
      {invert ? outputAmount.currency.symbol : swapAmount.currency.symbol}
      <span className="text-gray-600 dark:text-slate-500 !font-normal">
        ({formatUSD(Number(invert ? amountInUsd : amountOutUsd) || 0)})
      </span>
    </Button>
  )
}
