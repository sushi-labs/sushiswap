import { tryParseAmount } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import { FC, useMemo } from 'react'

import { CurrencyInputProps } from './CurrencyInput'
import { usePrice } from '@sushiswap/react-query'

type PricePanel = Pick<CurrencyInputProps, 'loading' | 'currency' | 'value' | 'usdPctChange'> & {
  error?: string
}

export const PricePanel: FC<PricePanel> = ({ loading, currency, value, usdPctChange, error }) => {
  const { data: price, isLoading } = usePrice({
    chainId: currency?.chainId,
    address: currency?.wrapped.address,
  })

  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])
  const [big, portion] = (parsedValue && price ? `${parsedValue.multiply(price.asFraction).toFixed(2)}` : '0.00').split(
    '.'
  )

  if (loading || isLoading)
    return (
      <div className="h-[36px] w-[60px] flex items-center">
        <Skeleton.Box className="h-[24px] w-full" />
      </div>
    )

  if (error) {
    return <p className="font-medium text-lg py-1 select-none text-red">{error}</p>
  }

  return (
    <p className="font-medium text-lg py-1 select-none text-gray-500 dark:text-slate-400">
      $ {big}.<span className="text-sm font-semibold">{portion}</span>
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
