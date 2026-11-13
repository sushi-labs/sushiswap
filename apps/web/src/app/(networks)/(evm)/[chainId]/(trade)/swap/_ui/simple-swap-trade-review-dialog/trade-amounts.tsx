'use client'

import { Currency, List, SkeletonText } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { useAmountUsd } from 'src/lib/hooks/use-amount-usd'
import type { Amount } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { ReviewAmountValue } from '../../../_ui/review-amount-value'

type ReviewAmount =
  | Amount<CurrencyFor<EvmChainId | SvmChainId | StellarChainId>>
  | null
  | undefined

export function TradeAmounts({
  amountIn,
  amountOut,
  amountInUSD,
  amountOutUSD,
  isLoading = false,
}: {
  amountIn: ReviewAmount
  amountOut: ReviewAmount
  amountInUSD?: string | number
  amountOutUSD?: string | number
  isLoading?: boolean
}): ReactElement {
  return (
    <List className="!pt-0">
      <List.Control className="!bg-transparent !rounded-2xl !py-2 !px-0">
        <List.KeyValue
          title={
            <div className="text-muted-foreground whitespace-nowrap">
              You sell
            </div>
          }
          fontWeight="normal"
          className="!py-2"
          flex
        >
          <TradeAmount
            amount={amountIn}
            usdValue={amountInUSD}
            isLoading={isLoading}
          />
        </List.KeyValue>
        <List.KeyValue
          title={
            <div className="text-muted-foreground whitespace-nowrap">
              Estimated received
            </div>
          }
          fontWeight="normal"
          className="!py-2"
          flex
        >
          <TradeAmount
            amount={amountOut}
            usdValue={amountOutUSD}
            isLoading={isLoading}
          />
        </List.KeyValue>
      </List.Control>
    </List>
  )
}

function TradeAmount({
  amount,
  usdValue,
  isLoading,
}: {
  amount: ReviewAmount
  usdValue?: string | number
  isLoading: boolean
}): ReactElement {
  const usd = useAmountUsd({
    amount,
    enabled: usdValue === undefined,
  })

  return (
    <ReviewAmountValue
      usdValue={amount ? (usdValue ?? usd.data) : undefined}
      isUsdLoading={isLoading || usd.isLoading}
    >
      <div className="flex items-center gap-1 text-lg">
        {isLoading ? (
          <SkeletonText align="right" fontSize="lg" className="!w-20" />
        ) : amount ? (
          <>
            <span className="truncate max-w-[220px]">
              {amount.toSignificant(6)}
            </span>
            <Currency.Icon currency={amount.currency} width={16} height={16} />
            {amount.currency.symbol}
          </>
        ) : (
          '-'
        )}
      </div>
    </ReviewAmountValue>
  )
}
