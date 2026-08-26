import type { CrossmintSupportedFiatCurrency } from 'src/config'
import { FIAT_CURRENCY_DETAILS } from '../fiat-currencies'

export const FiatCurrencyIcon = ({
  currency,
}: {
  currency: CrossmintSupportedFiatCurrency
}) => {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/10 text-xs font-semibold text-blue"
    >
      {FIAT_CURRENCY_DETAILS[currency].symbol}
    </span>
  )
}
