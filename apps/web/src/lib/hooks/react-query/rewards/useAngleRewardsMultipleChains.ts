import { useQuery } from '@tanstack/react-query'
import { isPromiseRejected } from 'sushi'
import type { EvmChainId } from 'sushi/chain'

import type { Address } from 'viem'
import { useAllPrices } from '../prices'
import { angleRewardsQueryFn, angleRewardsSelect } from './useAngleRewards'

interface UseAngleRewardsParams {
  chainIds: EvmChainId[]
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

            const chainPrices = prices.get(chainIds[i])!

            const data = angleRewardsSelect({
              chainId: chainIds[i]!,
              data: el.value[chainIds[i]!],
              prices: {
                get: (address: Address) =>
                  +(chainPrices.get(address) || 0)?.toFixed(18),
                getFraction: (address: Address) => chainPrices.get(address),
                has: (address: Address) => chainPrices.has(address),
              },
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
