import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { LowercaseMap } from 'sushi'
import { API_BASE_URL } from 'sushi/config'
import { withoutScientificNotation } from 'sushi/format'
import { Fraction } from 'sushi/math'
import { Address, parseUnits } from 'viem'

interface UsePrices {
  chainId: number | undefined
  enabled?: boolean
}

export const usePrices = ({ chainId, enabled = true }: UsePrices) => {
  return useQuery({
    queryKey: [`${API_BASE_URL}/price/v1/${chainId}`],
    queryFn: async () => {
      const data: Record<Address, number> = await fetch(
        `${API_BASE_URL}/price/v1/${chainId}`,
      ).then((response) => response.json())

      const priceMap = new LowercaseMap<Address, Fraction>()

      Object.entries(data).forEach(([address, _price]) => {
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

      return priceMap
    },
    staleTime: ms('15s'),
    gcTime: ms('1m'),
    enabled: Boolean(chainId && enabled),
  })
}
