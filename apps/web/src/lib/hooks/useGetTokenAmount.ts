import { getMeldQuotes } from '@funkit/api-base'
import { useEffect, useRef, useState } from 'react'

type DestinationToken = {
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

type UseGetTokenAmountResult = {
  tokenAmount?: number
  netFiatAmount?: number
  isLoading: boolean
  isOutdated: boolean
  error?: string
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

const useDebouncedNumber = (
  value: number | undefined,
  delay: number,
): number | undefined => {
  const [debounced, setDebounced] = useState<number | undefined>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)

    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

export const useGetTokenAmount = ({
  countryCode,
  sourceCurrencyCode,
  amount,
  destinationTokenSymbol,
  paymentMethodType,
  debounceMs = 500,
}: UseGetTokenAmountParams): UseGetTokenAmountResult => {
  const [tokenAmount, setTokenAmount] = useState<number | undefined>(undefined)
  const [netFiatAmount, setNetFiatAmount] = useState<number | undefined>(
    undefined,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isOutdated, setIsOutdated] = useState(false)

  const debouncedAmount = useDebouncedNumber(amount, debounceMs)
  const requestSeq = useRef(0)

  useEffect(() => {
    setIsOutdated(amount !== debouncedAmount)
  }, [amount, debouncedAmount])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY || ''
    const normalizedCountry = normalizeCountryCode(
      countryCode,
      sourceCurrencyCode,
    )

    if (
      !normalizedCountry ||
      !sourceCurrencyCode ||
      !destinationTokenSymbol ||
      !paymentMethodType ||
      !debouncedAmount
    ) {
      setTokenAmount(undefined)
      setNetFiatAmount(undefined)
      setError(undefined)
      setIsLoading(false)
      return
    }

    const current = ++requestSeq.current

    setIsLoading(true)
    setError(undefined)

    getMeldQuotes({
      apiKey,
      params: {
        countryCode: normalizedCountry,
        sourceCurrencyCode,
        sourceAmount: `${debouncedAmount as number}`,
        destinationCurrencyCode: destinationTokenSymbol,
        paymentMethodType,
      },
    })
      .then((res) => {
        if (current !== requestSeq.current) return
        const best = [...res.quotes].sort(
          (a, b) => b.destinationAmount - a.destinationAmount,
        )[0]

        if (!best) {
          setTokenAmount(undefined)
          setNetFiatAmount(undefined)
          setIsLoading(false)

          return
        }

        const netFiat =
          typeof best.fiatAmountWithoutFees === 'number'
            ? best.fiatAmountWithoutFees
            : best.sourceAmount - (best.totalFee ?? 0)

        setTokenAmount(best.destinationAmount)
        setNetFiatAmount(netFiat)
        setIsLoading(false)
      })
      .catch((e: unknown) => {
        if (current !== requestSeq.current) {
          return
        }

        setTokenAmount(undefined)
        setNetFiatAmount(undefined)
        setError(e instanceof Error ? e.message : 'Failed to fetch quotes')
        setIsLoading(false)
      })
  }, [
    countryCode,
    sourceCurrencyCode,
    destinationTokenSymbol,
    paymentMethodType,
    debouncedAmount,
  ])

  return { tokenAmount, netFiatAmount, isLoading, isOutdated, error }
}

export type {
  UseGetTokenAmountParams,
  UseGetTokenAmountResult,
  DestinationToken,
}
