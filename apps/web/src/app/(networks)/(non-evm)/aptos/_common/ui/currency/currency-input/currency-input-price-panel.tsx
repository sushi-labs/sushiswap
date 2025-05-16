import { SkeletonText } from '@sushiswap/ui'
import React, { type FC } from 'react'

interface CurrencyInputPricePanel {
  isLoading: boolean
  error?: string
  value: string
}

export const CurrencyInputPricePanel: FC<CurrencyInputPricePanel> = ({
  isLoading,
  error,
  value,
}) => {
  const currencyValueStr =
    value && !Number.isNaN(Number(value))
      ? `${Number(value).toFixed(2)}`
      : '0.00'

  if (isLoading) {
    return (
      <div className="w-[90px] flex items-center">
        <SkeletonText fontSize="sm" className="w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="font-medium text-sm py-1 select-none text-red">{error}</p>
    )
  }

  return (
    <p className="font-medium text-sm flex items-baseline select-none text-gray-500 dark:text-slate-400">
      ${currencyValueStr}
    </p>
  )
}
