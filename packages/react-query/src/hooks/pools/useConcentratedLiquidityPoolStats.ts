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
}))

export const useConcentratedLiquidityPoolStats = ({ poolAddress, enabled = true }: UseConcentratedLiquidityPoolStats) => {
    return useQuery({
        queryKey: [`useConcentratedLiquidityPoolStats`],
        queryFn: async () => {
            const data = await fetch(`https://pools-git-feature-cliq.sushi.com/api/v0?&poolTypes=CONCENTRATED_LIQUIDITY_POOL&poolVersions=V3`)
            const resp = await data.json()
            return schema.parse(resp)
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
