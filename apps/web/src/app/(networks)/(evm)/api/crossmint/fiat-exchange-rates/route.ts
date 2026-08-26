import {
  CROSSMINT_SUPPORTED_FIAT_CURRENCIES,
  type CrossmintSupportedFiatCurrency,
} from 'src/config'
import { createFiatExchangeRatesResponse } from 'src/lib/crossmint/fiat-exchange-rates'

const FRANKFURTER_RATES_URL = 'https://api.frankfurter.dev/v2/rates'
const CACHE_MAX_AGE_SECONDS = 60 * 60
const CACHE_STALE_WHILE_REVALIDATE_SECONDS = 24 * 60 * 60

function getRateQuotes(): Exclude<CrossmintSupportedFiatCurrency, 'usd'>[] {
  return CROSSMINT_SUPPORTED_FIAT_CURRENCIES.filter(
    (currency): currency is Exclude<CrossmintSupportedFiatCurrency, 'usd'> =>
      currency !== 'usd',
  )
}

export async function GET() {
  const url = new URL(FRANKFURTER_RATES_URL)
  url.searchParams.set('base', 'USD')
  url.searchParams.set(
    'quotes',
    getRateQuotes()
      .map((currency) => currency.toUpperCase())
      .join(','),
  )

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_MAX_AGE_SECONDS },
    })

    if (!response.ok) {
      throw new Error(`Frankfurter responded with ${response.status}`)
    }

    const rates = createFiatExchangeRatesResponse(await response.json())

    return Response.json(rates, {
      headers: {
        'Cache-Control': `max-age=${CACHE_MAX_AGE_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE_SECONDS}`,
      },
    })
  } catch (error) {
    console.error('Unable to fetch fiat exchange rates', error)

    return Response.json(
      { message: 'Fiat exchange rates are temporarily unavailable' },
      { status: 502 },
    )
  }
}
