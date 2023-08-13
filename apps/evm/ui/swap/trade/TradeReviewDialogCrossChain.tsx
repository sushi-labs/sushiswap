'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Chain, chainName } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Collapsible } from '@sushiswap/ui/components/animation/Collapsible'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { Dots } from '@sushiswap/ui/components/dots'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import React, { FC, useCallback } from 'react'

import { useTrade } from '../../../lib/swap/useTrade'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { ConfirmationDialogCrossChain } from '../ConfirmationDialogCrossChain/ConfirmationDialogCrossChain'
import { useSwapActions, useSwapState } from './TradeProvider'

export const TradeReviewDialogCrossChain: FC = () => {
  const { review, token0, token1, recipient, network0, network1, amount, value } = useSwapState()
  const { setReview } = useSwapActions()
  const [slippageTolerance] = useSlippageTolerance()
  const { data: trade, isFetching } = useTrade({ crossChain: true, enabled: review })

  const onClose = useCallback(() => setReview(false), [setReview])

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
              <SkeletonText fontSize="3xl" className="w-2/3" />
            ) : (
              <h1 className="text-3xl font-semibold dark:text-slate-50">
                Receive {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
              </h1>
            )}
            <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">
              Swap {amount?.toSignificant(6)} {token0?.symbol}
            </h1>
          </div>
          <div className="min-w-[56px] min-h-[56px]">
            <div className="pr-1">
              <Badge
                position="bottom-right"
                badgeContent={
                  <div className="bg-gray-100 border-2 border-gray-100 rounded-full dark:border-slate-500">
                    <NetworkIcon width={24} height={24} chainId={network1} />
                  </div>
                }
              >
                {token1 ? (
                  <Currency.Icon currency={token1} width={56} height={56} />
                ) : (
                  <SkeletonCircle radius={56} className="bg-gray-100 dark:bg-slate-800" />
                )}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <List>
            <List.Control>
              <List.KeyValue title="Network">
                <div className="justify-end w-full gap-1 truncate whitespace-nowrap">
                  {chainName?.[network0]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
                  <br />
                  <span className="text-gray-400 dark:text-slate-500">to</span>{' '}
                  {chainName?.[network1]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
                </div>
              </List.KeyValue>
              <List.KeyValue
                title="Price impact"
                subtitle="The impact your trade has on the market price of this pool."
              >
                {isFetching ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/5" />
                ) : (
                  `${
                    trade?.priceImpact?.lessThan(ZERO) ? '+' : trade?.priceImpact?.greaterThan(ZERO) ? '-' : ''
                  }${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%`
                )}
              </List.KeyValue>
              <List.KeyValue
                title={`Min. received after slippage (${slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%)`}
                subtitle="The minimum amount you are guaranteed to receive."
              >
                {isFetching ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/2" />
                ) : (
                  `${trade?.minAmountOut?.toSignificant(6)} ${token1?.symbol}`
                )}
              </List.KeyValue>
              {/* <List.KeyValue title="Network fee">
                {isFetching ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/3" />
                ) : (
                  `~$${trade?.gasSpent ?? '0.00'}`
                )}
              </List.KeyValue> */}
              <List.KeyValue title="Network fee">
                {isFetching ? (
                  <SkeletonText align="right" fontSize="sm" className="w-1/3" />
                ) : (
                  `~${trade?.gasSpent} ${Native.onChain(network0).symbol}`
                )}
              </List.KeyValue>
            </List.Control>
          </List>
          {recipient && (
            <List className="!pt-2">
              <List.Control>
                <List.KeyValue title="Recipient">
                  <a
                    target="_blank"
                    href={Chain.accountUrl(network0, recipient) ?? '#'}
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
          <ConfirmationDialogCrossChain>
            {({ onClick, isWritePending, isLoading, isError, error, isConfirming }) => (
              <div className="space-y-4">
                <Button
                  fullWidth
                  size="xl"
                  loading={isLoading && !isError}
                  onClick={onClick}
                  disabled={isWritePending || Boolean(isLoading && +value > 0) || isError}
                  color={isError ? 'red' : warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                >
                  {isError ? (
                    'Shoot! Something went wrong :('
                  ) : isConfirming ? (
                    <Dots>Confirming transaction</Dots>
                  ) : isWritePending ? (
                    <Dots>Confirm Swap</Dots>
                  ) : (
                    `Swap ${token0?.symbol} for ${token1?.symbol}`
                  )}
                </Button>
                <Collapsible open={Boolean(error)}>
                  <div className="scroll bg-red/10 text-red-700 p-2 px-3 rounded-lg break-all">{error?.message}</div>
                </Collapsible>
              </div>
            )}
          </ConfirmationDialogCrossChain>
        </div>
      </div>
    </Dialog>
  )
}
