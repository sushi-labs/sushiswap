import { tryParseAmount, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import { FC, useMemo } from 'react'

import { CurrencyInputProps } from './CurrencyInput'
import { usePrice } from '@sushiswap/react-query'
import { Fraction, ZERO } from '@sushiswap/math'

type PricePanel = Pick<CurrencyInputProps, 'loading' | 'currency' | 'value' | 'usdPctChange'> & {
  error?: string
  price: Fraction | undefined
}

export const PricePanel: FC<PricePanel> = ({ loading, price, currency, value, usdPctChange, error }) => {
  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])
  const [big, portion] = (parsedValue && price ? `${parsedValue.multiply(price.asFraction).toFixed(2)}` : '0.00').split(
    '.'
  )

  if (loading)
    return (
      <div className="h-[36px] w-1/5 flex items-center">
        <Skeleton.Text fontSize="text-lg" className="w-full" />
      </div>
    )

  if (error) {
    return <p className="font-medium text-lg py-1 select-none text-red">{error}</p>
  }

  return (
    <p className="font-medium text-lg py-1 select-none text-gray-500 dark:text-slate-400">
      {!loading && price?.equalTo(ZERO) ? (
        <span className="text-sm italic">N/A</span>
      ) : (
        <>
          $ {big}.<span className="text-sm font-semibold">{portion}</span>
        </>
      )}
      {usdPctChange && (
        <span
          className={classNames(
            'text-sm',
            usdPctChange === 0
              ? ''
              : usdPctChange > 0
              ? 'text-green'
              : usdPctChange < -5
              ? 'text-red'
              : usdPctChange < -3
              ? 'text-yellow'
              : 'text-slate-500'
          )}
        >
          {' '}
          {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
            usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
          }%)`}
        </span>
      )}
    </p>
  )
}
