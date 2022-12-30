'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import chains, { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import Container from '@sushiswap/ui13/components/Container'
import { Currency } from '@sushiswap/ui13/components/currency'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { List } from '@sushiswap/ui13/components/list/List'
import { FC, useCallback } from 'react'

import { useSwapActions, useSwapState } from './TradeProvider'
import { SwapButton } from './widget/SwapButton'

export const TradeReviewDialog: FC = () => {
  const { review, token0, token1, recipient, network0 } = useSwapState()
  const { setReview } = useSwapActions()

  const onClose = useCallback(() => {
    setReview(false)
  }, [setReview])

  return (
    <Dialog open={review} onClose={onClose} variant="opaque">
      <Container maxWidth={520} className="mx-auto flex flex-col mt-4 gap-4 sm:p-4">
        <button onClick={onClose} className="-ml-2 p-2">
          <ArrowLeftIcon strokeWidth={3} width={20} height={20} />
        </button>
        <div className="flex justify-between gap-4 items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold dark:text-slate-50">Receive 8.38338 {token1.symbol}</h1>
            <h1 className="text-lg font-medium text-gray-900 dark:text-slate-300">Sell 0.05 {token0.symbol}</h1>
          </div>
          <div className="min-w-[56px] min-h-[56px]">
            <Currency.Icon currency={token1} width={56} height={56} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <List>
            <List.Control>
              <List.KeyValue title="Network">{chains[network0].name}</List.KeyValue>
              <List.KeyValue title="Network fee">~$1.18</List.KeyValue>
              <List.KeyValue title="Route">
                <button className="text-blue">View route</button>
              </List.KeyValue>
              <List.KeyValue
                title="Price impact"
                subtitle="The impact your trade has on the market price of this pool."
              >
                -0.08%
              </List.KeyValue>
              <List.KeyValue
                title="Minimum received after slippage"
                subtitle="The minimum amount you are guaranteed to receive."
              >
                8.21408 {token1.symbol}
              </List.KeyValue>
            </List.Control>
          </List>
          {recipient && (
            <List className="!pt-0">
              <List.Control>
                <List.KeyValue title="Recipient">
                  <a
                    target="_blank"
                    href={Chain.fromChainId(network0)?.getAccountUrl(recipient) ?? '#'}
                    className="flex gap-2 items-center text-blue transition-all cursor-pointer"
                    rel="noreferrer"
                  >
                    {shortenAddress(recipient)}
                  </a>
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </div>
      </Container>
      <SwapButton />
    </Dialog>
  )
}
