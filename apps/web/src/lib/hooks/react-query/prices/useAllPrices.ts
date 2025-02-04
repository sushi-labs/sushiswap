import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { type ChainId, LowercaseMap } from 'sushi'
import { withoutScientificNotation } from 'sushi/format'
import { Fraction } from 'sushi/math'
import { type Address, parseUnits } from 'viem'

const hydrate = (data: Record<Address, number>) => {
  const chainPriceMap = new Map<ChainId, LowercaseMap<Address, Fraction>>()

  Object.entries(data).forEach(([chainId, addresses]) => {
    const priceMap = new LowercaseMap<Address, Fraction>()

    Object.entries(addresses).forEach(([address, _price]) => {
      const price = withoutScientificNotation(_price.toFixed(18))
      if (typeof price !== 'undefined') {
        priceMap.set(
          address as Address,
          new Fraction(
            parseUnits(price, 18).toString(),
            parseUnits('1', 18).toString(),
          ),
        )
      }
    })

    chainPriceMap.set(Number.parseInt(chainId) as ChainId, priceMap)
  })

  return chainPriceMap
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
