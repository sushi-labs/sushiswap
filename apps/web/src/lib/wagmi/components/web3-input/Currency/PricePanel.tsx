import { classNames } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { Amount, ZERO } from 'sushi'
import type { CurrencyInputProps } from './CurrencyInput'

type PricePanel = Pick<
  CurrencyInputProps,
  'loading' | 'currency' | 'value' | 'priceImpact' | 'className'
> & {
  error?: string
  price: number | undefined
}

export const PricePanel: FC<PricePanel> = ({
  loading,
  price,
  currency,
  value,
  priceImpact,
  error,
}) => {
  const parsedValue = useMemo(
    () => (currency ? Amount.tryFromHuman(currency, value) : undefined),
    [currency, value],
  )
  const currencyValueStr =
    parsedValue && price
      ? `${((price * Number(parsedValue.amount)) / 10 ** parsedValue.currency.decimals).toFixed(2)}`
      : '0.00'

  if (loading)
    return (
      <div className="w-1/5 flex items-center">
        <SkeletonText fontSize="sm" className="w-full" />
      </div>
    )

  if (error) {
    return <p className="font-medium text-sm select-none text-red">{error}</p>
  }

  return (
    <p className="font-medium text-sm flex items-baseline select-none text-gray-500 dark:text-slate-400">
      {!loading && price === 0 ? 'Price not available' : `$${currencyValueStr}`}
      {!(!loading && price === 0) && priceImpact && (
        <span
          className={classNames(
            'text-sm pl-1',
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
