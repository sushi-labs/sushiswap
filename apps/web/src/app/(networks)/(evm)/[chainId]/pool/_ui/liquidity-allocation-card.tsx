'use client'

import {
  Card,
  Currency,
  Separator,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { useAmountUsd } from 'src/lib/hooks/use-amount-usd'
import { useCurrencyIconColor } from 'src/lib/hooks/use-currency-icon-color'
import { type Amount, formatUSD } from 'sushi'
import { EvmChainId, type EvmCurrency, unwrapEvmToken } from 'sushi/evm'

const totalFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
const balanceFormatter = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 9,
})
const shareFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
})

function useAllocationAsset(amount: Amount<EvmCurrency> | undefined) {
  const currency =
    amount && amount.currency.chainId === EvmChainId.ARC
      ? amount.currency
      : amount && unwrapEvmToken(amount.currency)
  const color = useCurrencyIconColor(currency)
  const isZero = amount?.amount === 0n
  const { data, isLoading } = useAmountUsd({ amount, enabled: !isZero })

  return { amount, currency, color, value: isZero ? 0 : data, isLoading }
}

interface LiquidityAllocationCardProps {
  title: string
  amount0?: Amount<EvmCurrency>
  amount1?: Amount<EvmCurrency>
  isLoading?: boolean
}

export function LiquidityAllocationCard({
  title,
  amount0,
  amount1,
  isLoading = false,
}: LiquidityAllocationCardProps): ReactElement {
  const first = useAllocationAsset(amount0)
  const second = useAllocationAsset(amount1)
  const total =
    first.value !== undefined && second.value !== undefined
      ? first.value + second.value
      : undefined
  const isValueLoading = isLoading || first.isLoading || second.isLoading
  const showAllocation = !isValueLoading && total !== undefined && total > 0

  return (
    <Card className="min-w-0 p-5 text-primary" aria-busy={isValueLoading}>
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="mt-2 break-words text-2xl font-medium sm:text-3xl">
        {isValueLoading ? (
          <SkeletonText fontSize="2xl" className="max-w-44" />
        ) : total === undefined ? (
          '—'
        ) : (
          totalFormatter.format(total)
        )}
      </div>
      <div className="mb-2 mt-4 text-xs text-muted-foreground">
        Asset Allocation
      </div>
      <div
        aria-hidden="true"
        className={classNames(
          'flex h-2 gap-px overflow-hidden rounded-sm',
          !showAllocation && 'bg-muted',
          isValueLoading && 'animate-pulse',
        )}
      >
        {showAllocation &&
          [first, second].map(({ currency, value, color }, index) =>
            currency && value ? (
              <div
                key={currency.id}
                className={classNames(
                  'rounded-sm',
                  index === 0 ? 'bg-pink' : 'bg-blue',
                )}
                style={{
                  width: `${(value / total) * 100}%`,
                  backgroundColor: color,
                }}
              />
            ) : null,
          )}
      </div>
      {isLoading || amount0 || amount1 ? (
        <div className="mt-5">
          <AllocationRow asset={first} total={total} isLoading={isLoading} />
          <div className="-mx-3 my-4">
            <Separator />
          </div>
          <AllocationRow asset={second} total={total} isLoading={isLoading} />
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          Token balances unavailable
        </p>
      )}
    </Card>
  )
}

function AllocationRow({
  asset: { amount, currency, value, isLoading: isPriceLoading },
  total,
  isLoading,
}: {
  asset: ReturnType<typeof useAllocationAsset>
  total: number | undefined
  isLoading: boolean
}): ReactElement {
  const symbol = currency?.symbol

  return (
    <div className="flex items-center gap-3">
      {currency ? (
        <Currency.Icon currency={currency} width={36} height={36} />
      ) : isLoading ? (
        <SkeletonCircle radius={36} />
      ) : null}
      <div className="min-w-0 flex-1">
        {isLoading ? (
          <SkeletonText className="max-w-24" />
        ) : (
          <>
            <div className="truncate font-semibold" title={symbol}>
              {symbol ?? '—'}
            </div>
            <div
              className="truncate text-sm text-muted-foreground"
              title={amount && `${amount.toString()} ${symbol ?? ''}`}
            >
              {amount
                ? balanceFormatter.format(Number(amount.toString()))
                : '—'}{' '}
              {symbol}
            </div>
          </>
        )}
      </div>
      <div className="shrink-0 text-right">
        {isLoading || isPriceLoading ? (
          <SkeletonText className="w-16" />
        ) : (
          <>
            <div className="font-medium">
              {value === undefined ? '—' : formatUSD(value)}
            </div>
            <div className="text-sm text-muted-foreground">
              {total && value !== undefined
                ? shareFormatter.format(value / total)
                : '—'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
