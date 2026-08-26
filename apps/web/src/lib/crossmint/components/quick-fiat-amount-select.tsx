'use client'

import { Button } from '@sushiswap/ui'
import { useMemo } from 'react'
import type { CrossmintSupportedFiatCurrency } from 'src/config'
import { convertUsdToWholeFiatAmount } from '../fiat-exchange-rates'
import { useFiatExchangeRates } from '../hooks/use-fiat-exchange-rates'
import { useFiatLocale } from '../hooks/use-fiat-locale'

export const DEFAULT_QUICK_FIAT_AMOUNTS_USD = [10, 25, 50, 100] as const

export interface QuickFiatAmountSelectProps {
  amountsUsd?: readonly number[]
  className?: string
  currency: CrossmintSupportedFiatCurrency
  disabled?: boolean
  onChange(value: string): void
}

export function QuickFiatAmountSelect({
  amountsUsd = DEFAULT_QUICK_FIAT_AMOUNTS_USD,
  className,
  currency,
  disabled = false,
  onChange,
}: QuickFiatAmountSelectProps) {
  const locale = useFiatLocale()
  const exchangeRates = useFiatExchangeRates({ enabled: currency !== 'usd' })
  const rate = currency === 'usd' ? 1 : exchangeRates.data?.rates[currency]
  const amountFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: 'currency',
      }),
    [currency, locale],
  )
  const usdFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: 'currency',
      }),
    [locale],
  )
  const isRateLoading = currency !== 'usd' && !rate && exchangeRates.isLoading
  const isRateUnavailable = currency !== 'usd' && !rate

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-2">
        {amountsUsd.map((amountUsd) => {
          const convertedAmount = rate
            ? convertUsdToWholeFiatAmount(amountUsd, rate)
            : undefined
          const label = convertedAmount
            ? amountFormatter.format(Number(convertedAmount))
            : usdFormatter.format(amountUsd)

          return (
            <Button
              key={amountUsd}
              type="button"
              size="sm"
              fullWidth
              loading={isRateLoading}
              disabled={disabled || isRateUnavailable}
              variant={'secondary'}
              className="focus:bg-secondary"
              onClick={() => {
                if (convertedAmount) onChange(convertedAmount)
              }}
              aria-label={
                convertedAmount
                  ? `Set amount to ${label}, approximately ${usdFormatter.format(amountUsd)}`
                  : `Approximately ${usdFormatter.format(amountUsd)}`
              }
              title={
                isRateUnavailable
                  ? 'Exchange rate unavailable'
                  : `Approximately ${usdFormatter.format(amountUsd)}`
              }
            >
              {label}
            </Button>
          )
        })}
      </div>
      {exchangeRates.isError && currency !== 'usd' ? (
        <p role="alert" className="mt-1.5 px-1 text-xs text-muted-foreground">
          Currency conversion is temporarily unavailable.
        </p>
      ) : null}
    </div>
  )
}
