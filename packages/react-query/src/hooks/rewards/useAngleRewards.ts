import {parseUnits} from "@ethersproject/units";
import {ChainId} from "@sushiswap/chain";
import {Amount, Token, tryParseAmount} from "@sushiswap/currency";
import {useQuery} from "@tanstack/react-query";
import z from 'zod'

import {angleRewardsBaseValidator,angleRewardsPoolsValidator} from "./validator";

type TransformedRewardsPerToken = Record<string, {
    accumulatedSinceInception: Amount<Token>;
    breakdown: Record<string, Amount<Token>>;
    symbol: string;
    unclaimed: Amount<Token>
}>

type TransformedPoolItem = Omit<z.infer<typeof angleRewardsPoolsValidator>, 'rewardsPerToken'> & {
    rewardsPerToken: TransformedRewardsPerToken
}

type TransformedPools = Record<string, TransformedPoolItem>

interface UseAngleRewardsParams {
    chainId: ChainId
    account: string | undefined
}

export const useAngleRewards = ({ chainId, account }: UseAngleRewardsParams) => {
    return useQuery({
        queryKey: ['getRewards', { chainId, account }],
        queryFn: async () => {
            if (account) {
                const res = await (await fetch(`https://api.angle.money/v1/merkl?chainId=${chainId}&user=${account}`)).json()
                return angleRewardsBaseValidator.parse(res)
            }

            tryParseAmount()
            return null
        },
        select: (data) => {
            if (!data || !data.pools) {
                return undefined
            }

            return {
                ...data,
                pools: Object.entries(data.pools).reduce<TransformedPools>((acc, [a, b]) => {
                    acc[a] = {
                        ...b,
                        rewardsPerToken: Object.entries(b.rewardsPerToken).reduce<TransformedRewardsPerToken>((acc, [k, v]) => {
                            const token0 = new Token({chainId, address: k, decimals: v.decimals, symbol: v.symbol})

                            acc[k] = {
                                accumulatedSinceInception: Amount.fromRawAmount(token0, parseUnits(v.accumulatedSinceInception.toString(), v.decimals).toString()),
                                breakdown: Object.entries(v.breakdown).reduce<Record<string, Amount<Token>>>((acc, [i, j]) => {
                                    acc[i] = Amount.fromRawAmount(token0, parseUnits(j.toString(), v.decimals).toString())
                                    return acc
                                }, {}),
                                symbol: v.symbol,
                                unclaimed: Amount.fromRawAmount(token0, v.unclaimedUnformatted)
                            }
                            return acc
                        }, {})
                    }

                    return acc
                }, {}),
            }
        },
        staleTime: 15000, // 15 seconds
        cacheTime: 60000 // 1min
    })
}
