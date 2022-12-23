'use client'

import { tryParseAmount } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import React, { FC, useMemo } from 'react'

import { usePrices } from '../../../hooks'
import { CurrencyInputProps } from './index'

type PricePanel = Pick<CurrencyInputProps, 'currency' | 'value' | 'usdPctChange'>

export const PricePanel: FC<PricePanel> = ({ currency, value, usdPctChange }) => {
  const { data: tokenPrices } = usePrices({ chainId: currency?.chainId })
  const price = currency ? tokenPrices?.[currency.wrapped.address] : undefined
  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])

  if (!tokenPrices)
    return (
      <div className="h-[24px] w-[60px] flex items-center">
        <Skeleton.Box className="bg-white/[0.06] h-[12px] w-full" />
      </div>
    )

  return (
    <p className="text-xs py-1 select-none text-slate-400">
      {parsedValue && price ? `$${parsedValue.multiply(price.asFraction).toFixed(2)}` : '$0.00'}
      {usdPctChange && (
        <span
          className={classNames(
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
