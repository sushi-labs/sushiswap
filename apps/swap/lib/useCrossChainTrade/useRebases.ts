import { useQuery } from '@tanstack/react-query'
import { Type } from '@sushiswap/currency'
import { getBentoboxTotals } from './getBentoboxTotals'
import { JSBI } from '@sushiswap/math'
import { BigNumber } from '@ethersproject/bignumber'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox/exports'

interface UseBentoboxTotalsParams {
  chainId: BentoBoxV1ChainId
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
      if (!data) return null

      return data.map(({ base, elastic }) => ({
        base: JSBI.BigInt(BigNumber.from(base)),
        elastic: JSBI.BigInt(BigNumber.from(elastic)),
      }))
    },
    refetchInterval: 10000,
  })
}
