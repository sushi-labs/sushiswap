import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'

import { useAllPrices } from '../prices'
import { angleRewardsQueryFn, angleRewardsSelect } from './useAngleRewards'
import { angleRewardsMultipleValidator } from './validator'

interface UseAngleRewardsParams {
  chainIds: ChainId[]
  account: string | undefined
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
        const res = await Promise.all(
          chainIds.map((chainId) => angleRewardsQueryFn({ chainId, account })),
        )
        const parsed = angleRewardsMultipleValidator.parse(res)

        return parsed
          .map((el, i) => {
            const data = angleRewardsSelect({
              chainId: chainIds[i]!,
              data: el,
              prices: prices[chainIds[i]!],
            })

            return data
              ? {
                  chainId: chainIds[i]!,
                  ...data,
                }
              : null
          })
          .filter((el): el is NonNullable<typeof el> => el !== null)
      }

      return null
    },
    staleTime: 15000, // 15 seconds
    cacheTime: 60000, // 1min
  })
}
