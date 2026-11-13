import { classNames } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { useMemo } from 'react'
import { Amount, ZERO } from 'sushi'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import {
  warningSeverity,
  warningSeverityClassName,
} from '../../../../swap/warning-severity'
import type { CurrencyInputProps } from './currency-input'

type PricePanel<TChainId extends BalanceChainId> = Pick<
  CurrencyInputProps<TChainId>,
  'loading' | 'currency' | 'value' | 'priceImpact' | 'className'
> & {
  error?: string
  price: number | undefined
}

export function PricePanel<TChainId extends BalanceChainId>({
  loading,
  price,
  currency,
  value,
  priceImpact,
  error,
  className,
}: PricePanel<TChainId>) {
  const isEmptyValue = value === ''
  const parsedValue = useMemo(
    () => (currency ? Amount.tryFromHuman(currency, value) : undefined),
    [currency, value],
  )
  const hasPrice = price !== undefined && price !== 0
  const isPriceUnavailable = !isEmptyValue && !hasPrice
  const [big, portion] = (
    !isEmptyValue && parsedValue && hasPrice
      ? `${(
          (price * Number(parsedValue.amount)) /
            10 ** parsedValue.currency.decimals
        ).toFixed(2)}`
      : '0.00'
  ).split('.')

  if (loading && !isEmptyValue)
    return (
      <div className="w-16 h-4 shrink-0 flex items-center">
        <SkeletonText fontSize="xs" className="w-full" />
      </div>
    )

  if (error) {
    return <p className="font-medium text-xs select-none text-red">{error}</p>
  }

  return (
    <p
      className={classNames(
        'font-medium text-xs flex items-baseline select-none text-muted-foreground',
        className,
      )}
    >
      {isPriceUnavailable ? (
        <span
          aria-label="USD estimate unavailable"
          title="USD estimate unavailable"
        >
          $ -
        </span>
      ) : (
        <>
          $ {big}.<span className="text-xs">{portion}</span>
        </>
      )}
      {!isEmptyValue && !isPriceUnavailable && priceImpact && (
        <span
          className={classNames(
            'text-xs pl-1',
            warningSeverityClassName(warningSeverity(priceImpact)),
          )}
        >
          {priceImpact?.lt(ZERO) ? '+' : priceImpact?.gt(ZERO) ? '-' : ''}
          {Math.abs(Number(priceImpact?.toString({ fixed: 2 })) || 0)}%
        </span>
      )}
    </p>
  )
}
