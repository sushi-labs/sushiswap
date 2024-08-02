import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { withoutScientificNotation } from 'sushi/format'
import { Fraction } from 'sushi/math'
import { getAddress, isAddress, parseUnits } from 'viem'

const hydrate = (data: Record<string, number>) => {
  return Object.entries(data).reduce<Record<string, Record<string, Fraction>>>(
    (acc, [chainId, addresses]) => {
      acc[chainId] = Object.entries(addresses).reduce<Record<string, Fraction>>(
        (acc, [address, _price]) => {
          const price = withoutScientificNotation(_price.toFixed(18))
          if (isAddress(address) && typeof price !== 'undefined') {
            acc[getAddress(address)] = new Fraction(
              parseUnits(price, 18).toString(),
              parseUnits('1', 18).toString(),
            )
          }

          return acc
        },
        {},
      )

      return acc
    },
    {},
  )
}

export const useAllPrices = (
  { enabled = true }: { enabled?: boolean } = { enabled: true },
) => {
  return useQuery({
    queryKey: ['/api/price'],
    queryFn: async () =>
      fetch('/api/price').then((response) => response.json()),
    staleTime: ms('60s'),
    gcTime: ms('1h'),
    refetchOnWindowFocus: false,
    select: hydrate,
    enabled,
  })
}
