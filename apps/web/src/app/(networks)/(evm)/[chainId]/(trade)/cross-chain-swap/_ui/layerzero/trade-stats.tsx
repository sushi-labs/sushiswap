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
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/gas-icon'
import { type ReactNode, useEffect, useId, useMemo, useState } from 'react'
import { Price, getChainById, shortenAddress } from 'sushi'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import { SourceNetworkFee } from './source-network-fee'
import { useLayerZeroXSwap } from './xswap-provider'

export function LayerZeroTradeStats(): ReactNode {
  const {
    state: { chainId0, chainId1, swapAmount },
    previewQuote,
    sourceNetworkFee,
  } = useLayerZeroXSwap()
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
  const hasValidQuote = Boolean(swapAmount?.gt(0n) && !previewQuote.error)
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
      <div
        className="flex items-center justify-between gap-2"
        aria-label="Loading swap details"
      >
        <SkeletonText fontSize="sm" className="!w-[100px]" />
        <div className="flex items-center gap-0.5">
          <SkeletonText fontSize="sm" className="!w-[60px]" />
          <SkeletonCircle radius={26} />
        </div>
      </div>
    )
  }

  const messagingFee = `${amounts.messagingFee.toSignificant(6)} ${amounts.messagingFee.currency.symbol}`

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 text-gray-700 dark:text-slate-400">
        <Button
          className="!text-xs !font-medium !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
          variant="ghost"
          size="xs"
          aria-label="Invert exchange rate"
          onClick={() => setInvert((value) => !value)}
        >
          1{' '}
          {invert
            ? amounts.amountOut.currency.symbol
            : amounts.amountIn.currency.symbol}{' '}
          = {price}{' '}
          {invert
            ? amounts.amountIn.currency.symbol
            : amounts.amountOut.currency.symbol}
        </Button>
        <div className="ml-auto flex items-center gap-0.5">
          <div
            className={classNames(
              'text-xs font-medium flex items-center transition-opacity',
              isDetailsCollapsed ? 'opacity-100' : 'opacity-0',
            )}
          >
            <GasIcon className="inline-block w-3 h-4 mr-0.5" />
            <SourceNetworkFee
              fee={sourceNetworkFee}
              currency={amounts.messagingFee.currency}
              display="usd"
            />
          </div>
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
            <IconButton
              icon={ChevronDownIcon}
              size="xs"
              name="Toggle Swap Details"
              aria-expanded={!isDetailsCollapsed}
              aria-controls={detailsId}
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
      </div>
      <Collapsible open={!isDetailsCollapsed}>
        <div
          id={detailsId}
          aria-hidden={isDetailsCollapsed}
          inert={isDetailsCollapsed}
          className="pt-2 w-full flex flex-col gap-1"
        >
          <Stat title="Est. received">
            {amounts.amountOut.toSignificant(6)}{' '}
            {amounts.amountOut.currency.symbol}
          </Stat>
          <Stat title="Min. received">
            {amounts.minimumAmountOut.toSignificant(6)}{' '}
            {amounts.minimumAmountOut.currency.symbol}
          </Stat>
          <Stat title="Protocol fee">
            {amounts.protocolFee.toSignificant(6)}{' '}
            {amounts.protocolFee.currency.symbol}
          </Stat>
          <Stat
            title={
              <>
                LayerZero fee{' '}
                <Explainer>
                  Includes a 10% buffer. Unused messaging fees are refunded to
                  your source wallet.
                </Explainer>
              </>
            }
          >
            {messagingFee}
          </Stat>
          <Stat title="Network fee">
            <SourceNetworkFee
              fee={sourceNetworkFee}
              currency={amounts.messagingFee.currency}
              display="usd"
            />
          </Stat>
          <Stat title="Provider">LayerZero</Stat>
          {recipient ? (
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
              <span className="font-medium text-sm text-gray-700 dark:text-slate-300">
                Recipient
              </span>
              <a
                href={getChainById(chainId1).getAccountUrl(recipient)}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sm text-gray-700 dark:text-slate-300"
              >
                {shortenAddress(recipient)}
              </a>
            </div>
          ) : null}
        </div>
      </Collapsible>
    </>
  )
}

function Stat({
  title,
  children,
}: { title: ReactNode; children: ReactNode }): ReactNode {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm text-gray-700 dark:text-slate-400 inline-flex items-center gap-1">
        {title}
      </span>
      <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
        {children}
      </span>
    </div>
  )
}
