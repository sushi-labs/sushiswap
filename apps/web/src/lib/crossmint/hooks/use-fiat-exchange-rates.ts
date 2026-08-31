'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { fetchFiatExchangeRates } from '../fiat-exchange-rates'

interface UseFiatExchangeRatesInput {
  enabled?: boolean
}

export function useFiatExchangeRates({
  enabled = true,
}: UseFiatExchangeRatesInput = {}) {
  return useQuery({
    queryKey: ['/api/crossmint/fiat-exchange-rates'],
    queryFn: ({ signal }) => fetchFiatExchangeRates(signal),
    enabled,
    gcTime: ms('24h'),
    refetchOnWindowFocus: false,
    staleTime: ms('1h'),
  })
}
