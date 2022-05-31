import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import { currencyFormatter } from 'app/functions'
import { useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import React from 'react'

export const ValueCell = (amount: CurrencyAmount<Currency>, balancesLoading?: boolean) => {
  const { value, loading } = useUSDCValueWithLoadingIndicator(balancesLoading ? undefined : amount)

  if (loading || balancesLoading) {
    return (
      <div className="flex gap-2.5 items-center justify-end w-full">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
          <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Typography weight={700} className="w-full text-right text-high-emphesis">
        {value ? `${currencyFormatter.format(Number(value.toExact()))}` : '-'}
      </Typography>
      <Typography weight={400} variant="sm" className="text-right text-low-emphesis">
        {amount.toSignificant(6)}
      </Typography>
    </div>
  )
}
