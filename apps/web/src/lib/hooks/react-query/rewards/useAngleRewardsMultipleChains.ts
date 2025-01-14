import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'
import { Address } from 'viem'
import { useAllPrices } from '../prices'
import { angleRewardsQueryFn, angleRewardsSelect } from './useAngleRewards'

interface UseAngleRewardsParams {
  chainIds: ChainId[]
  account: Address | undefined
}

export const useAngleRewardsMultipleChains = ({
  chainIds,
  account,
}: UseAngleRewardsParams) => {
  const { data: prices } = useAllPrices()

  return useQuery({
    queryKey: ['getAngleRewardsMultiple', { chainIds, account, prices }],
    queryFn: async () => {
      if (account && prices) {
        const res = await angleRewardsQueryFn({ chainIds, account })

        return Object.entries(res)
          .map(([_chainId, el]) => {
            const chainId = +_chainId as ChainId
            const chainPrices = prices.get(chainId)!

            const data = angleRewardsSelect({
              chainId,
              data: el,
              prices: {
                get: (address: Address) =>
                  +(chainPrices.get(address) || 0)?.toFixed(18),
                getFraction: (address: Address) => chainPrices.get(address),
                has: (address: Address) => chainPrices.has(address),
              },
            })

            return data
              ? {
                  chainId,
                  ...data,
                }
              : null
          })
          .filter((el): el is NonNullable<typeof el> => el !== null)
      }

      return null
    },
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min,
    enabled: !!account,
  })
}
