import z from 'zod'

export const angleRewardsPoolsValidator = z.object({
  aprs: z.record(z.string(), z.number().nullable()),
  decimalsToken0: z.number(),
  decimalsToken1: z.number(),
  distributionData: z.array(
    z.object({
      amm: z.number().optional(),
      amount: z.number(),
      breakdown: z.record(z.string(), z.number()).optional(),
      endTimestamp: z.number(),
      isOutOfRangeIncentivized: z.boolean(),
      isLive: z.boolean(),
      propFees: z.number(),
      propToken0: z.number(),
      propToken1: z.number(),
      startTimestamp: z.number(),
      rewardToken: z.string(),
      symbolRewardToken: z.string(),
      unclaimed: z.number().optional(),
      whitelist: z.array(z.string()),
    }),
  ),
  poolTotalLiquidity: z.number(),
  meanAPR: z.number().nullable(),
  pool: z.string(),
  poolFee: z.number(),
  rewardsPerToken: z.record(
    z.string(),
    z.object({
      accumulatedSinceInception: z.number(),
      breakdownOfAccumulated: z.record(z.string(), z.number()),
      breakdownOfUnclaimed: z.record(z.string(), z.number()),
      decimals: z.number(),
      symbol: z.string(),
      unclaimed: z.number(),
      unclaimedUnformatted: z.string(),
    }),
  ),
  token0: z.string(),
  poolBalanceToken0: z.number(),
  token1: z.string(),
  poolBalanceToken1: z.number(),
  symbolToken0: z.string(),
  symbolToken1: z.string(),
  tvl: z.number().nullable().default(0),
  almDetails: z
    .array(
      z.object({
        balance0: z.number().optional().nullable(),
        balance1: z.number().optional().nullable(),
        origin: z.number(),
        tvl: z.number().optional().nullable(),
      }),
    )
    .optional(),
  userTVL: z.number().optional().nullable().default(0),
  userBalanceToken0: z.number().optional(),
  userBalanceToken1: z.number().optional(),
})

export const angleRewardsValidator = z.record(
  z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  z.object({
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
        }),
      )
      .optional(),
    validRewardTokens: z
      .array(
        z
          .object({
            minimumAmountPerEpoch: z.number(),
            token: z.string(),
            decimals: z.number(),
            symbol: z.string(),
          })
          .catch(undefined as never),
      )
      .transform((tokens) =>
        tokens.filter((token) => typeof token !== 'undefined'),
      )
      .optional(),
  }),
)

export const angleRewardsMultipleValidator = z.array(angleRewardsValidator)

export const angleRewardTokensValidator = z.object({
  validRewardTokens: z
    .array(
      z
        .object({
          minimumAmountPerEpoch: z.number(),
          token: z.string(),
          decimals: z.number(),
          symbol: z.string(),
        })
        .catch(undefined as never),
    )
    .transform((tokens) =>
      tokens.filter((token) => typeof token !== 'undefined'),
    ),
})
