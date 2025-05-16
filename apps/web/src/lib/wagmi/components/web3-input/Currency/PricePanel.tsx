import { classNames } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { tryParseAmount } from 'sushi/currency'
import { ZERO } from 'sushi/math'
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
  className,
}) => {
  const parsedValue = useMemo(
    () => tryParseAmount(value, currency),
    [currency, value],
  )
  const currencyValueStr =
    parsedValue && price
      ? `${(
          (price * Number(parsedValue.quotient)) /
            10 ** parsedValue.currency.decimals
        ).toFixed(2)}`
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
<<<<<<< HEAD
    <p
      className={classNames(
        'font-medium text-lg flex items-baseline select-none text-gray-500 dark:text-slate-400',
        className,
      )}
    >
      {!loading && price === 0 ? (
        <span className="text-sm flex items-center">Price not available</span>
      ) : (
        <>
          $ {big}.<span className="text-sm font-semibold">{portion}</span>
        </>
      )}
=======
    <p className="font-medium text-sm flex items-baseline select-none text-gray-500 dark:text-slate-400">
      {!loading && price === 0 ? 'Price not available' : `$${currencyValueStr}`}
>>>>>>> 6d0b61e939 (feat: new input design & color palette)
      {!(!loading && price === 0) && priceImpact && (
        <span
          className={classNames(
            'text-sm pl-1',
            warningSeverityClassName(warningSeverity(priceImpact)),
          )}
        >
          {priceImpact?.lessThan(ZERO)
            ? '+'
            : priceImpact?.greaterThan(ZERO)
              ? '-'
              : ''}
          {Math.abs(Number(priceImpact?.toFixed(2)) || 0)}%
        </span>
      )}
    </p>
  )
}
