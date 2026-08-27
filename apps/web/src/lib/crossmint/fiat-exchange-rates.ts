import {
  type CrossmintSupportedFiatCurrency,
  isCrossmintSupportedFiatCurrency,
} from 'src/config'
import { z } from 'zod'

export type FiatExchangeRates = Record<CrossmintSupportedFiatCurrency, number>

export interface FiatExchangeRatesResponse {
  base: 'usd'
  date: string
  rates: FiatExchangeRates
}

const frankfurterRatesSchema = z.array(
  z.object({
    base: z.literal('USD'),
    date: z.string().min(1),
    quote: z.string().length(3),
    rate: z.number().positive(),
  }),
)

const fiatExchangeRatesResponseSchema: z.ZodType<FiatExchangeRatesResponse> =
  z.object({
    base: z.literal('usd'),
    date: z.string().min(1),
    rates: z.object({
      aud: z.number().positive(),
      eur: z.number().positive(),
      gbp: z.number().positive(),
      hkd: z.number().positive(),
      inr: z.number().positive(),
      jpy: z.number().positive(),
      krw: z.number().positive(),
      sgd: z.number().positive(),
      usd: z.literal(1),
      vnd: z.number().positive(),
    }),
  })

function parseResponseBody(body: string): unknown {
  if (!body) return undefined

  try {
    return JSON.parse(body)
  } catch {
    return body
  }
}

function getErrorMessage(payload: unknown): string | undefined {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message
  }

  return undefined
}

export function createFiatExchangeRatesResponse(
  payload: unknown,
): FiatExchangeRatesResponse {
  const rows = frankfurterRatesSchema.parse(payload)
  const rates: Partial<FiatExchangeRates> = { usd: 1 }

  for (const row of rows) {
    const quote = row.quote.toLowerCase()

    if (isCrossmintSupportedFiatCurrency(quote)) {
      rates[quote] = row.rate
    }
  }

  return fiatExchangeRatesResponseSchema.parse({
    base: 'usd',
    date: rows[0]?.date,
    rates,
  })
}

export function parseFiatExchangeRatesResponse(
  payload: unknown,
): FiatExchangeRatesResponse {
  return fiatExchangeRatesResponseSchema.parse(payload)
}

export async function fetchFiatExchangeRates(
  signal?: AbortSignal,
): Promise<FiatExchangeRatesResponse> {
  const response = await fetch('/api/crossmint/fiat-exchange-rates', { signal })
  const payload = parseResponseBody(await response.text())

  if (!response.ok) {
    const message = getErrorMessage(payload)

    throw new Error(
      message ?? `Fiat exchange rates request failed with ${response.status}`,
    )
  }

  return parseFiatExchangeRatesResponse(payload)
}

export function convertUsdToWholeFiatAmount(
  amountUsd: number,
  rate: number,
): string {
  if (!Number.isFinite(amountUsd) || amountUsd < 0) {
    throw new Error('USD amount must be a non-negative finite number')
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Fiat exchange rate must be a positive finite number')
  }

  return Math.round(amountUsd * rate).toString()
}

export function convertFiatToUsdAmount(
  amountFiat: number,
  rate: number,
): string {
  if (!Number.isFinite(amountFiat) || amountFiat <= 0) {
    throw new Error('Fiat amount must be a positive finite number')
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Fiat exchange rate must be a positive finite number')
  }

  return (amountFiat / rate).toFixed(2)
}
