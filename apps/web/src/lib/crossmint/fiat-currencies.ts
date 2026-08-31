import type { CrossmintSupportedFiatCurrency } from 'src/config'

interface FiatCurrencyDetails {
  minorUnits: number
  name: string
  symbol: string
}

export const FIAT_CURRENCY_DETAILS = {
  usd: { minorUnits: 2, name: 'US Dollar', symbol: '$' },
  aud: { minorUnits: 2, name: 'Australian Dollar', symbol: 'A$' },
  eur: { minorUnits: 2, name: 'Euro', symbol: '€' },
  gbp: { minorUnits: 2, name: 'British Pound', symbol: '£' },
  hkd: { minorUnits: 2, name: 'Hong Kong Dollar', symbol: 'HK$' },
  inr: { minorUnits: 2, name: 'Indian Rupee', symbol: '₹' },
  jpy: { minorUnits: 0, name: 'Japanese Yen', symbol: '¥' },
  krw: { minorUnits: 0, name: 'South Korean Won', symbol: '₩' },
  sgd: { minorUnits: 2, name: 'Singapore Dollar', symbol: 'S$' },
  vnd: { minorUnits: 0, name: 'Vietnamese Dong', symbol: '₫' },
} as const satisfies Record<CrossmintSupportedFiatCurrency, FiatCurrencyDetails>
