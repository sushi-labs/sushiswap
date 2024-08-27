import { useQuery } from '@tanstack/react-query'
import { isPromiseRejected } from 'sushi'
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
        const res = await Promise.allSettled(
          chainIds.map((chainId) =>
            angleRewardsQueryFn({ chainIds: [chainId], account }),
          ),
        )

        return res
          .map((el, i) => {
            if (isPromiseRejected(el)) return null
            const data = angleRewardsSelect({
              chainId: chainIds[i]!,
              data: el.value[chainIds[i]!],
              prices: prices.get(chainIds[i]!),
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
    gcTime: 60000, // 1min,
    enabled: !!account,
  })
}
