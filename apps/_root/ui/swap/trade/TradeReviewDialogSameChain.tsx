'use client'

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { List } from '@sushiswap/ui/future/components/list/List'
import React, { FC, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './TradeProvider'
import { useTrade } from '../../../lib/swap/useTrade'
import { Button } from '@sushiswap/ui/future/components/button'
import { ConfirmationDialog } from '../ConfirmationDialog'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { AppType } from '@sushiswap/ui/types'
import { Native } from '@sushiswap/currency'
import { classNames, Collapsible } from '@sushiswap/ui'
import { warningSeverity, warningSeverityClassName } from '../../../lib/swap/warningSeverity'
import { TradeRoute } from './TradeRoute'
import { ZERO } from '@sushiswap/math'
import { useSlippageTolerance } from '@sushiswap/hooks'

export const TradeReviewDialogSameChain: FC = () => {
  const [open, setOpen] = useState(false)
  const { appType, review, token0, token1, recipient, network0, amount, value } = useSwapState()
  const { setReview } = useSwapActions()
  const [slippageTolerance] = useSlippageTolerance()
  const { data: trade, isFetching } = useTrade({ crossChain: false })

  const onClose = useCallback(() => setReview(false), [setReview])
  const isWrap =
    appType === AppType.Swap && token0?.isNative && token1?.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1?.isNative && token0?.wrapped.address === Native.onChain(network0).wrapped.address
  const isSwap = !isWrap && !isUnwrap

  console.log('TradeReviewDialogSameChain')

  // Don't unmount this dialog since that will slow down the opening callback
  return (
    <Dialog open={review} unmount={false} onClose={onClose} variant="opaque">
      <div className="max-w-[504px] mx-auto">
        <button type="button" onClick={onClose} className="p-3 pl-0">
          <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
        </button>
        <div className="flex items-start justify-between gap-4 py-2">
          <div className="flex flex-col flex-grow gap-1">
            {isFetching ? (
              <Skeleton.Text fontSize="text-3xl" className="w-2/3" />
            ) : (
              <h1 className="text-3xl font-semibold dark:text-slate-50">
                Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
              </h1>
            )}
            <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">
              {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'} {amount?.toSignificant(6)} {token0?.symbol}
            </h1>
          </div>
          <div className="min-w-[56px] min-h-[56px]">
            <div className="pr-1">
              <Badge
                position="bottom-right"
                badgeContent={
                  <div className="bg-gray-100 border-2 border-gray-100 rounded-full">
                    <PlusIcon
                      strokeWidth={2}
                      width={24}
                      height={24}
                      className="bg-blue text-white rounded-full p-0.5"
                    />
                  </div>
                }
              >
                {token1 ? (
                  <Currency.Icon currency={token1} width={56} height={56} />
                ) : (
                  <Skeleton.Circle radius={56} className="bg-gray-100 dark:bg-slate-800" />
                )}
              </Badge>
            </div>
          </div>
        </div>
        {warningSeverity(trade?.priceImpact) >= 3 && (
          <div className="px-4 py-3 mt-4 rounded-xl bg-red/20">
            <span className="text-sm font-medium text-red-600">
              High price impact. You will lose a significant portion of your funds in this trade due to price impact.
            </span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <List>
            <List.Control>
              <List.KeyValue title="Network">{Chain.from(network0).name}</List.KeyValue>
              {isSwap && (
                <List.KeyValue
                  title="Price impact"
                  subtitle="The impact your trade has on the market price of this pool."
                >
                  <span
                    className={classNames(
                      warningSeverityClassName(warningSeverity(trade?.priceImpact)),
                      'text-gray-700 text-right dark:text-slate-400 text-yellow text-yellow-700 text-green'
                    )}
                  >
                    {isFetching ? (
                      <Skeleton.Box className="h-4 py-0.5 w-[60px] rounded-md" />
                    ) : (
                      `${
                        trade?.priceImpact?.lessThan(ZERO) ? '+' : trade?.priceImpact?.greaterThan(ZERO) ? '-' : ''
                      }${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%` ?? '-'
                    )}
                  </span>
                </List.KeyValue>
              )}
              {isSwap && (
                <List.KeyValue
                  title={`Min. received after slippage (${slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%)`}
                  subtitle="The minimum amount you are guaranteed to receive."
                >
                  {isFetching ? (
                    <Skeleton.Text align="right" fontSize="text-sm" className="w-1/2" />
                  ) : (
                    `${trade?.minAmountOut?.toSignificant(6)} ${token1?.symbol}`
                  )}
                </List.KeyValue>
              )}
              <List.KeyValue title="Network fee">
                {isFetching ? (
                  <Skeleton.Text align="right" fontSize="text-sm" className="w-1/3" />
                ) : (
                  `~$${trade?.gasSpent ?? '0.00'}`
                )}
              </List.KeyValue>
              {isSwap && (
                <List.KeyValue title="Route">
                  {isFetching ? (
                    <Skeleton.Text align="right" fontSize="text-sm" className="w-1/3" />
                  ) : (
                    <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-blue">
                      View
                    </button>
                  )}
                  <TradeRoute trade={trade} open={open} setOpen={setOpen} />
                </List.KeyValue>
              )}
            </List.Control>
          </List>
          {recipient && (
            <List className="!pt-2">
              <List.Control>
                <List.KeyValue title="Recipient">
                  <a
                    target="_blank"
                    href={Chain.fromChainId(network0)?.getAccountUrl(recipient) ?? '#'}
                    className="flex items-center gap-2 cursor-pointer text-blue"
                    rel="noreferrer"
                  >
                    {shortenAddress(recipient)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </div>
        <div className="pt-4">
          <ConfirmationDialog>
            {({ onClick, isWritePending, isLoading, isError, error, isConfirming }) => (
              <div className="space-y-4">
                <Button
                  fullWidth
                  size="xl"
                  loading={isLoading && !isError}
                  onClick={onClick}
                  disabled={isWritePending || Boolean(isLoading && +value > 0) || isError}
                  color={isError ? 'red' : warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                  testId="confirm-swap"
                >
                  {isError ? (
                    'Shoot! Something went wrong :('
                  ) : isConfirming ? (
                    <Dots>Confirming transaction</Dots>
                  ) : isWritePending ? (
                    <Dots>Confirm Swap</Dots>
                  ) : isWrap ? (
                    'Wrap'
                  ) : isUnwrap ? (
                    'Unwrap'
                  ) : (
                    `Swap ${token0?.symbol} for ${token1?.symbol}`
                  )}
                </Button>
                <Collapsible open={Boolean(error)}>
                  <div className="scroll bg-red/10 text-red-700 p-2 px-3 rounded-lg break-all">{error?.message}</div>
                </Collapsible>
              </div>
            )}
          </ConfirmationDialog>
        </div>
      </div>
    </Dialog>
  )
}
