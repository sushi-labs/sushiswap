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
        <span className="text-sm flex items-center">
          Price is unknown{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 ml-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </span>
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
