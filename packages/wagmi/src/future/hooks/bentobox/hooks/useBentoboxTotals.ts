import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'

import { getBentoboxTotals } from '../actions'

interface UseBentoboxTotalsParams {
  chainId: ChainId
  currencies: (Type | undefined)[]
  enabled?: boolean
}

const queryFn = async ({ chainId, currencies }: UseBentoboxTotalsParams) => {
  if (isBentoBoxV1ChainId(chainId)) {
    return await getBentoboxTotals(chainId, currencies)
  }

  return undefined
}

export const useBentoboxTotals = ({ enabled = true, ...variables }: UseBentoboxTotalsParams) => {
  const { currencies, chainId } = variables
  return useQuery({
    queryKey: ['useBentoboxTotals', { chainId, currencies }],
    enabled,
    queryFn: async () => {
      const data = await queryFn(variables)
      if (!data) return null

      return data.map(({ base, elastic }) => ({
        base,
        elastic,
      }))
    },
    refetchInterval: 10000,
  })
}
