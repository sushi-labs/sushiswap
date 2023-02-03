'use client'

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Chain, chainName } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { useSlippageTolerance } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui13/components/currency'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { List } from '@sushiswap/ui13/components/list/List'
import React, { FC, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './TradeProvider'
import { useTrade } from '../../lib/useTrade'
import numeral from 'numeral'
import { Button } from '@sushiswap/ui13/components/button'
import { Dots } from '@sushiswap/ui13/components/Dots'
import { FixedButtonContainer } from '../FixedButtonContainer'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import { Drawer } from '@sushiswap/ui13/components/drawer'
import { Badge } from '@sushiswap/ui13/components/Badge'
import { ConfirmationDialogCrossChain } from '../ConfirmationDialogCrossChain'
import { TradeRoute } from './TradeRoute'

export const TradeReviewDialogCrossChain: FC = () => {
  const [open, setOpen] = useState(false)
  const { review, token0, token1, recipient, network0, amount, value } = useSwapState()
  const { setReview } = useSwapActions()
  const { data: slippageTolerance } = useSlippageTolerance()
  const { data: trade, isFetching } = useTrade()

  const onClose = useCallback(() => setReview(false), [setReview])

  // Don't unmount this dialog since that will slow down the opening callback
  return (
    <Dialog open={review} unmount={false} onClose={onClose} variant="opaque">
      <div className="max-w-[504px] mx-auto">
        <button onClick={onClose} className="pl-0 p-3">
          <ArrowLeftIcon strokeWidth={3} width={24} height={24} />
        </button>
        <div className="flex justify-between gap-4 items-start py-2">
          <div className="flex flex-col flex-grow gap-1">
            {isFetching ? (
              <Skeleton.Text fontSize="text-3xl" className="w-2/3" />
            ) : (
              <h1 className="text-3xl font-semibold dark:text-slate-50">
                Receive {trade?.amountOut?.toSignificant(6)} {token1.symbol}
              </h1>
            )}
            <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">
              Swap {amount?.toSignificant(6)} {token0.symbol}
            </h1>
          </div>
          <div className="min-w-[56px] min-h-[56px]">
            <div className="pr-1">
              <Badge
                position="bottom-right"
                badgeContent={
                  <div className="bg-gray-100 rounded-full border-2 border-gray-100">
                    <PlusIcon
                      strokeWidth={2}
                      width={24}
                      height={24}
                      className="bg-blue text-white rounded-full p-0.5"
                    />
                  </div>
                }
              >
                <Currency.Icon currency={token1} width={56} height={56} />
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <List>
            <List.Control>
              <List.KeyValue title="Network">{Chain.from(network0).name}</List.KeyValue>
              <List.KeyValue
                title="Price impact"
                subtitle="The impact your trade has on the market price of this pool."
              >
                {isFetching ? (
                  <Skeleton.Text align="right" fontSize="text-sm" className="w-1/5" />
                ) : (
                  numeral(trade?.priceImpact ?? 0).format('0.00%')
                )}
              </List.KeyValue>
              <List.KeyValue
                title={`Min. received after slippage (${slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%)`}
                subtitle="The minimum amount you are guaranteed to receive."
              >
                {isFetching ? (
                  <Skeleton.Text align="right" fontSize="text-sm" className="w-1/2" />
                ) : (
                  `${trade?.minAmountOut?.toSignificant(6)} ${token1.symbol}`
                )}
              </List.KeyValue>
              <List.KeyValue title="Network fee">
                {isFetching ? (
                  <Skeleton.Text align="right" fontSize="text-sm" className="w-1/3" />
                ) : (
                  `~$${trade?.gasSpent ?? '0.00'}`
                )}
              </List.KeyValue>
              <List.KeyValue title="Route">
                {isFetching ? (
                  <Skeleton.Text align="right" fontSize="text-sm" className="w-1/3" />
                ) : (
                  <button onClick={() => setOpen(true)} className="text-sm text-blue font-semibold">
                    View Route
                  </button>
                )}
                <TradeRoute trade={trade} open={open} setOpen={setOpen} />
              </List.KeyValue>
            </List.Control>
          </List>
          {recipient && (
            <List className="!pt-2">
              <List.Control>
                <List.KeyValue title="Recipient">
                  <a
                    target="_blank"
                    href={Chain.fromChainId(network0)?.getAccountUrl(recipient) ?? '#'}
                    className="flex gap-2 items-center text-blue cursor-pointer"
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
            {({ onClick, isWritePending, isLoading, isConfirming }) => (
              <Button
                size="xl"
                fullWidth
                loading={isLoading}
                onClick={onClick}
                disabled={isWritePending || Boolean(isLoading && +value > 0) || isFetching}
              >
                {isConfirming ? (
                  <Dots>Confirming transaction</Dots>
                ) : isWritePending ? (
                  <Dots>Confirm Swap</Dots>
                ) : (
                  `Swap ${token0.symbol} for ${token1.symbol}`
                )}
              </Button>
            )}
          </ConfirmationDialogCrossChain>
        </div>
      </div>
    </Dialog>
  )
}
