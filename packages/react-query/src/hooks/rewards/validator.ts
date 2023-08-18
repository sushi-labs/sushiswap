import z from 'zod'

export const angleRewardsPoolsValidator = z.object({
  aprs: z.record(z.string(), z.number().nullable()),
  decimalToken0: z.number(),
  decimalToken1: z.number(),
  distributionData: z.array(
    z.object({
      amm: z.number().optional(),
      amount: z.number(),
      breakdown: z.record(z.string(), z.number()).optional(),
      end: z.number(),
      isOutOfRangeIncentivized: z.boolean(),
      isLive: z.boolean(),
      propFees: z.number(),
      propToken0: z.number(),
      propToken1: z.number(),
      start: z.number(),
      token: z.string(),
      tokenSymbol: z.string(),
      unclaimed: z.number().optional(),
      wrappers: z.array(z.unknown()),
    })
  ),
  liquidity: z.number(),
  meanAPR: z.number().nullable(),
  pool: z.string(),
  poolFee: z.number(),
  rewardsPerToken: z.record(
    z.string(),
    z.object({
      accumulatedSinceInception: z.number(),
      breakdown: z.record(z.string(), z.number()),
      decimals: z.number(),
      symbol: z.string(),
      unclaimed: z.number(),
      unclaimedUnformatted: z.string(),
    })
  ),
  token0: z.string(),
  token0InPool: z.number(),
  token1: z.string(),
  token1InPool: z.number(),
  tokenSymbol0: z.string(),
  tokenSymbol1: z.string(),
  tvl: z.number().nullable(),
  almDetails: z.array(
    z.object({
      balance0: z.number().optional().nullable(),
      balance1: z.number().optional().nullable(),
      origin: z.number(),
      tvl: z.number().optional().nullable(),
    })
  ),
  userTVL: z.number().nullable(),
  userTotalBalance0: z.number().nullable(),
  userTotalBalance1: z.number().nullable(),
})

export const angleRewardsBaseValidator = z.object({
  feeRebate: z.number().optional(),
  message: z.string().optional(),
  pools: z.record(z.string(), angleRewardsPoolsValidator),
  signed: z.boolean().optional(),
  transactionData: z
    .record(
      z.string(),
      z.object({
        claim: z.string(),
        leaf: z.string(),
        token: z.string(),
        proof: z.array(z.string()),
      })
    )
    .optional(),
  validRewardTokens: z
    .array(z.object({ minimumAmountPerEpoch: z.number(), token: z.string(), decimals: z.number(), symbol: z.string() }))
    .optional(),
})

export const angleRewardsMultipleValidator = z.array(angleRewardsBaseValidator)

export const angleRewardTokensValidator = z.object({
  validRewardTokens: z.array(
    z.object({ minimumAmountPerEpoch: z.number(), token: z.string(), decimals: z.number(), symbol: z.string() })
  ),
})
