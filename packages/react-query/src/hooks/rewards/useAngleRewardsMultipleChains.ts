import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'

import { useAllPrices } from '../prices'
import { angleRewardsQueryFn, angleRewardsSelect } from './useAngleRewards'

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
        const res = await angleRewardsQueryFn({ chainIds, account })

        return Object.entries(res)
          .map(([key, value]) => {
            const data = angleRewardsSelect({
              chainId: +key as ChainId,
              data: value,
              prices: prices[key],
            })

            return data
              ? {
                  chainId: +key as ChainId,
                  ...data,
                }
              : null
          })
          .filter((el): el is NonNullable<typeof el> => el !== null)
      }

      return null
    },
    staleTime: 15000, // 15 seconds
    cacheTime: 60000, // 1min,
    enabled: !!account,
  })
}
