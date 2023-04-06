// eslint-disable-line camelcase
import {parseUnits} from "@ethersproject/units";
import {getPools,PoolType, PoolVersion} from '@sushiswap/client'
import {Amount, Token} from "@sushiswap/currency";
import type {} from '@sushiswap/database'
import {JSBI} from "@sushiswap/math";
import {useQuery} from "@tanstack/react-query";

interface UseConcentratedLiquidityPoolStats {
    poolAddress: string | undefined
    enabled?: boolean
}

export const useConcentratedLiquidityPoolStats = ({ poolAddress, enabled = true }: UseConcentratedLiquidityPoolStats) => {
    return useQuery({
        queryKey: [`useConcentratedLiquidityPoolStats`],
        queryFn: async () => {
            const data = await getPools({take: 1000, poolTypes: [PoolType.CONCENTRATED_LIQUIDITY_POOL], poolVersions: [PoolVersion.V3]})
            
            if (data) {
                return data.map(el => ({
                    ...el,
                    token0: new Token({
                        chainId: el.chainId,
                        address: el.token0.address,
                        decimals: el.token0.decimals,
                        name: el.token0.name,
                        symbol: el.token0.symbol,
                    }),
                    token1: new Token({
                        chainId: el.chainId,
                        address: el.token1.address,
                        decimals: el.token1.decimals,
                        name: el.token1.name,
                        symbol: el.token1.symbol,
                    }),
                    feeAmount: el.swapFee * 1000000,
                    incentives: el.incentives.map(incentive => {
                        const rewardToken = new Token({
                            chainId: incentive.chainId,
                            address: incentive.rewardToken.address,
                            decimals: incentive.rewardToken.decimals,
                            name: incentive.rewardToken.name,
                            symbol: incentive.rewardToken.symbol,
                        })

                        return {
                        ...incentive,
                        reward: Amount.fromRawAmount(rewardToken, JSBI.BigInt(parseUnits(incentive.rewardPerDay.toString(), incentive.rewardToken.decimals).toString())),
                    }})
                }))
            }

            return []
        },
        select: (data) => {
            return data.find(el => el.address.toLowerCase() === poolAddress?.toLowerCase())
        },
        enabled: Boolean(enabled && poolAddress),
        staleTime: 900000, // 15 mins
        cacheTime: 3600000, // 1hr
        refetchOnWindowFocus: false,
    })
}
