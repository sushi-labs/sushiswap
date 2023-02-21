import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { getBentoboxTotals } from './getBentoboxTotals'
import { JSBI } from '@sushiswap/math'
import { BigNumber } from '@ethersproject/bignumber'

interface UseBentoboxTotalsParams {
  chainId: ChainId
  currencies: (Type | undefined)[]
  enabled?: boolean
}

const queryFn = async ({ chainId, currencies }: UseBentoboxTotalsParams) => await getBentoboxTotals(chainId, currencies)

export const useBentoboxTotals = (variables: UseBentoboxTotalsParams) => {
  return useQuery({
    queryKey: ['NoCache', 'useBentoboxTotals', { chainId: variables.chainId, currencies: variables.currencies }],
    enabled: Boolean(variables.currencies) && (variables.enabled || true),
    queryFn: async () => {
      const data = await queryFn(variables)
      if (!data) return undefined

      return data.map(({ base, elastic }) => ({
        base: JSBI.BigInt(BigNumber.from(base)),
        elastic: JSBI.BigInt(BigNumber.from(elastic)),
      }))
    },
  })
}
