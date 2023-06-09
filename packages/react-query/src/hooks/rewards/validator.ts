import z from 'zod'

export const angleRewardsPoolsValidator = z.object({
    aprs: z.record(z.string(), z.number().nullable()),
    decimalToken0: z.number(),
    decimalToken1: z.number(),
    distributionData: z.array(
        z.object({
            amm: z.number(),
            amount: z.number(),
            breakdown: z.record(z.string(), z.number()),
            end: z.number(),
            isOutOfRangeIncentivized: z.boolean(),
            isLive: z.boolean(),
            propFees: z.number(),
            propToken0: z.number(),
            propToken1: z.number(),
            start: z.number(),
            token: z.string(),
            tokenSymbol: z.string(),
            unclaimed: z.number(),
            wrappers: z.array(z.unknown())
        })
    ),
    liquidity: z.number(),
    meanAPR: z.number().nullable(),
    pool: z.string(),
    poolFee: z.number(),
    rewardsPerToken: z.record(z.string(), z.object({
        accumulatedSinceInception: z.number(),
        breakdown: z.record(z.string(), z.number()),
        decimals: z.number(),
        symbol: z.string(),
        unclaimed: z.number(),
        unclaimedUnformatted: z.string()
    })),
    token0: z.string(),
    token0InPool: z.number(),
    token1: z.string(),
    token1InPool: z.number(),
    tokenSymbol0: z.string(),
    tokenSymbol1: z.string(),
    tvl: z.number().nullable(),
    userBalances: z.array(
        z.object({
            balance0: z.number(),
            balance1: z.number(),
            origin: z.number(),
            tvl: z.number().nullable()
        })
    ),
    userTVL: z.number().nullable(),
    userTotalBalance0: z.number(),
    userTotalBalance1: z.number()
})

export const angleRewardsBaseValidator = z.object({
    feeRebate: z.number(),
    message: z.string(),
    pools: z.record(z.string(), angleRewardsPoolsValidator),
    signed: z.boolean(),
    transactionData: z.record(z.string(), z.object({
        claim: z.string(),
        leaf: z.string(),
        token: z.string(),
        proof: z.array(z.string())
    })),
    validRewardTokens: z.array(
        z.object({ minimumAmountPerEpoch: z.number(), token: z.string() })
    )
})

export const angleRewardsMultipleValidator = z.array(angleRewardsBaseValidator)
