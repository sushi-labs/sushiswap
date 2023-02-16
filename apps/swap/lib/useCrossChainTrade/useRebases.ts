import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { getBentoboxTotals } from './getBentoboxTotals'

interface UseBentoboxTotalsParams {
  chainId: ChainId
  currencies: (Type | undefined)[]
}

const queryFn = async ({ chainId, currencies }: UseBentoboxTotalsParams) => await getBentoboxTotals(chainId, currencies)

export const useBentoboxTotals = (variables: UseBentoboxTotalsParams) => {
  return useQuery({
    queryKey: ['useBentoboxTotals', { chainId: variables.chainId, currencies: variables.currencies }],
    queryFn: async () => queryFn(variables),
  })
}
