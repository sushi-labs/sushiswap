import {parseUnits} from "@ethersproject/units";
import {Amount, Token} from "@sushiswap/currency";
import {JSBI} from "@sushiswap/math";
import {useQuery} from "@tanstack/react-query";
import z from 'zod'
interface UseConcentratedLiquidityPoolStats {
    poolAddress: string | undefined
    enabled?: boolean
}

const tokenSchema = z.object({
    id: z.string(),
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
})

const schema = z.array(z.object({
    id: z.string(),
    address: z.string(),
    name: z.string(),
    chainId: z.number(),
    version: z.string(),
    type: z.string(),
    swapFee: z.number(),
    twapEnabled: z.boolean(),
    totalSupply: z.string(),
    liquidityUSD: z.string(),
    volumeUSD: z.string(),
    feeApr: z.number(),
    incentiveApr: z.number(),
    totalApr: z.number(),
    isIncentivized: z.boolean(),
    wasIncentivized: z.boolean(),
    fees1d: z.string(),
    fees1w: z.string(),
    volume1d: z.string(),
    volume1w: z.string(),
    isBlacklisted: z.boolean(),
    token0: tokenSchema,
    token1: tokenSchema,
    incentives: z.array(z.object({
        chainId: z.number(),
        id: z.string(),
        rewardPerDay: z.number(),
        rewardToken: tokenSchema
    }))
}))

export const useConcentratedLiquidityPoolStats = ({ poolAddress, enabled = true }: UseConcentratedLiquidityPoolStats) => {
    return useQuery({
        queryKey: [`useConcentratedLiquidityPoolStats`],
        queryFn: async () => {
            const data = await fetch(`https://pools-git-feature-cliq.sushi.com/api/v0?&poolTypes=CONCENTRATED_LIQUIDITY_POOL&poolVersions=V3`)
            const resp = await data.json()
            const parsed = schema.parse(resp)

            if (parsed) {
                return parsed.map(el => ({
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
