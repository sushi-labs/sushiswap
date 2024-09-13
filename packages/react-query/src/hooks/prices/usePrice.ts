import { useMemo } from 'react'
import type { Fraction } from 'sushi'
import { Address } from 'viem'
import { usePrices } from './usePrices'

interface UsePrice {
  chainId: number | undefined
  address: Address | undefined
  enabled?: boolean
}

export const usePrice = ({ chainId, address, enabled = true }: UsePrice) => {
  const usePricesQuery = usePrices({
    chainId,
    enabled,
  })

  return useMemo(() => {
    return {
      ...usePricesQuery,
      data: (address ? usePricesQuery.data?.get(address) : undefined) as
        | Fraction
        | undefined,
    }
  }, [usePricesQuery, address])
}
