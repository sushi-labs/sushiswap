'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import * as z from 'zod'

const countryCodeSchema = z.object({
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/)
    .nullable(),
})

export function useCountryCode(): UseQueryResult<string | null, Error> {
  return useQuery({
    queryKey: ['geolocation', 'country-code'],
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/geolocation', {
        cache: 'no-store',
        signal,
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch country code: ${response.status}`)
      }

      const data: unknown = await response.json()
      return countryCodeSchema.parse(data).countryCode
    },
    staleTime: ms('5m'),
    gcTime: ms('5m'),
    retry: 1,
  })
}
