import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { currencyFormatter } from 'app/functions'
import { useUSDCPriceWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import React from 'react'

export const AssetCell = (amount: CurrencyAmount<Currency>, balancesLoading?: boolean) => {
  const { price, loading } = useUSDCPriceWithLoadingIndicator(balancesLoading ? undefined : amount.currency)

  if (loading || balancesLoading) {
    return (
      <div className="flex gap-2.5 items-center w-full h-10">
        <div className="rounded-full bg-dark-800 w-9 h-9 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
          <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 items-center h-10">
      <CurrencyLogo currency={amount.currency} className="!rounded-full" size={36} />
      <div className="flex flex-col">
        <Typography weight={700} className="text-left text-high-emphesis">
          {amount.currency.symbol}
        </Typography>
        {price && (
          <Typography weight={400} variant="sm" className="text-left text-low-emphesis">
            {currencyFormatter.format(Number(price?.toFixed()))}
          </Typography>
        )}
      </div>
    </div>
  )
}
