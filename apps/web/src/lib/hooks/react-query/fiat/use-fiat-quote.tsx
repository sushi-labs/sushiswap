import { getMeldQuotes } from '@funkit/api-base'
import { useDebounce } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'

export type DestinationToken = {
  chainId: number
  address: `0x${string}`
}

type UseGetTokenAmountParams = {
  countryCode?: string
  sourceCurrencyCode?: string
  amount?: number
  destinationTokenSymbol?: string
  paymentMethodType?: 'APPLE_PAY' | 'CARD'
  debounceMs?: number
}

const normalizeCountryCode = (
  countryCode: string | undefined,
  sourceCurrencyCode?: string,
): string | undefined => {
  if (!countryCode && sourceCurrencyCode) {
    const c = sourceCurrencyCode.toUpperCase()
    if (c === 'EUR') return 'DE'
    if (c === 'USD') return 'US'
    if (c === 'GBP') return 'GB'
  }
  if (!countryCode) return undefined
  const cc = countryCode.toUpperCase()
  if (cc === 'EU') return 'DE'
  if (cc === 'UK') return 'GB'
  if (/^[A-Z]{2}$/.test(cc)) return cc
  return undefined
}

const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY || ''

if (!apiKey) {
  console.warn(
    'FunKit API key is missing! Please set NEXT_PUBLIC_FUNKIT_API_KEY in your environment variables.',
  )
}

export const useFiatQuote = ({
  countryCode,
  sourceCurrencyCode,
  amount,
  destinationTokenSymbol,
  paymentMethodType,
  debounceMs = 250,
}: UseGetTokenAmountParams) => {
  const debouncedAmount = useDebounce(amount, debounceMs)
  const normalizedCountry = normalizeCountryCode(
    countryCode,
    sourceCurrencyCode,
  )

  return useQuery({
    queryKey: [
      'useFiatQuote',
      normalizedCountry,
      sourceCurrencyCode,
      debouncedAmount,
      destinationTokenSymbol,
      paymentMethodType,
    ],
    queryFn: async () => {
      if (
        !normalizedCountry ||
        !sourceCurrencyCode ||
        !debouncedAmount ||
        !destinationTokenSymbol ||
        !paymentMethodType
      ) {
        return null
      }

      const res = await getMeldQuotes({
        apiKey: process.env.NEXT_PUBLIC_FUNKIT_API_KEY!,
        params: {
          countryCode: normalizedCountry,
          sourceCurrencyCode,
          sourceAmount: `${debouncedAmount as number}`,
          destinationCurrencyCode: destinationTokenSymbol,
          paymentMethodType,
        },
      })

      const bestQuote = [...res.quotes]?.sort(
        (a, b) => b.destinationAmount - a.destinationAmount,
      )?.[0]

      if (!bestQuote) {
        return null
      }
      const netFiat =
        typeof bestQuote.fiatAmountWithoutFees === 'number'
          ? bestQuote.fiatAmountWithoutFees
          : bestQuote.sourceAmount - (bestQuote.totalFee ?? 0)
      return {
        ...bestQuote,
        tokenAmount: bestQuote.destinationAmount,
        netFiatAmount: netFiat,
      }
    },
    enabled: !!(
      normalizeCountryCode(countryCode, sourceCurrencyCode) &&
      sourceCurrencyCode &&
      debouncedAmount &&
      destinationTokenSymbol &&
      paymentMethodType
    ),
  })
}
