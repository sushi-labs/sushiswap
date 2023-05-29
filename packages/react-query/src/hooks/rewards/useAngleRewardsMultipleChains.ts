import {ChainId} from "@sushiswap/chain";
import {useQuery} from "@tanstack/react-query";

import {angleRewardsQueryFn, angleRewardsSelect} from "./useAngleRewards";
import {angleRewardsMultipleValidator} from "./validator";

interface UseAngleRewardsParams {
    chainIds: ChainId[]
    account: string | undefined
}

export const useAngleRewardsMultipleChains = ({ chainIds, account }: UseAngleRewardsParams) => {
    return useQuery({
        queryKey: ['getAngleRewardsMultiple', { chainIds, account }],
        queryFn: async () => {
            if (account) {
                const res = await Promise.all(chainIds.map(chainId => angleRewardsQueryFn({chainId, account})))
                return angleRewardsMultipleValidator.parse(res)
            }

            return null
        },
        select: (data) => {
            if (!data) return undefined
            return data.map((el, i) => ({
                chainId: chainIds[i],
                ...angleRewardsSelect(chainIds[i], el),
            }))
        },
        staleTime: 15000, // 15 seconds
        cacheTime: 60000 // 1min
    })
}
